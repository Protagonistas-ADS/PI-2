import db from "../configs/db";
import PedidoRepository, { type Pedido, type ItemPedido } from "../repositories/pedido.repository";
import EstoqueService from "./estoque.service";
import VendaService from "./venda.service";
import NotaService from "./nota.service";
import { NATUREZA_PADRAO } from "../schemas/nota.schema";
import { criarErro } from "../utils/criarErro";
import type { NovoPedido, StatusPedido } from "../schemas/pedido.schema";

// Para onde cada status pode ir. Entregue e cancelado são finais.
const PROXIMOS_STATUS: Record<StatusPedido, StatusPedido[]> = {
    pendente: ["confirmado", "cancelado"],
    confirmado: ["pronto_retirada", "cancelado"],
    pronto_retirada: ["entregue", "cancelado"],
    entregue: [],
    cancelado: []
};

// Nomes amigáveis para as mensagens de erro
const NOME_STATUS: Record<StatusPedido, string> = {
    pendente: "pendente",
    confirmado: "confirmado",
    pronto_retirada: "pronto para retirada",
    entregue: "entregue",
    cancelado: "cancelado"
};

// Status em que o estoque já foi baixado (cancelar nesses devolve o estoque)
const STATUS_COM_ESTOQUE_BAIXADO: StatusPedido[] = ["confirmado", "pronto_retirada"];

function temStatus(erro: unknown, status: number) {
    return erro instanceof Error && "status" in erro && erro.status === status;
}

// O MySQL devolve DECIMAL e SUM() como texto ("90.00"); a API devolve número (90).
function totaisComoNumero<T extends Pedido>(pedido: T): T {
    return {
        ...pedido,
        quantidade_total: Number(pedido.quantidade_total),
        valor_total: Number(pedido.valor_total)
    };
}

function itemComoNumero(item: ItemPedido): ItemPedido {
    return {
        ...item,
        preco_unitario: Number(item.preco_unitario),
        subtotal: Number(item.subtotal)
    };
}

const PedidoService = {

    async ListarPorCliente(cliente_id: number) {
        const pedidos = await PedidoRepository.ListarPorCliente(cliente_id);
        return pedidos.map(totaisComoNumero);
    },

    async ListarTodos() {
        const pedidos = await PedidoRepository.ListarTodos();
        return pedidos.map(totaisComoNumero);
    },

    async ListarItens(id: number, cliente_id: number) {
        const produtos = await PedidoRepository.ListarItens(id, cliente_id);

        if (produtos.length === 0) {
            throw criarErro("Pedido não encontrado.", 404);
        }

        return produtos.map(itemComoNumero);
    },

    // Administrador vê os itens de qualquer pedido
    async ListarItensAdmin(id: number) {
        const produtos = await PedidoRepository.ListarItensDoPedido(id);

        if (produtos.length === 0) {
            throw criarErro("Pedido não encontrado.", 404);
        }

        return produtos.map(itemComoNumero);
    },

    // Cliente cancela o próprio pedido (só enquanto está pendente)
    async Cancelar(id: number, cliente_id: number) {
        const resultado = await PedidoRepository.CancelarPendente(id, cliente_id);

        if (resultado.affectedRows > 0) return;

        const pedido = await PedidoRepository.BuscarResumo(id);

        if (!pedido || pedido.cliente_id !== cliente_id) {
            throw criarErro("Pedido não encontrado.", 404);
        }

        throw criarErro(
            pedido.status === "cancelado"
                ? "Este pedido já está cancelado."
                : `Este pedido já está ${NOME_STATUS[pedido.status]} e não pode mais ser cancelado pelo site. Fale com a loja pelo WhatsApp.`,
            409
        );
    },

    // Cria o pedido com status 'pendente'. O estoque só é conferido aqui;
    // a baixa acontece quando o administrador confirma.
    async Criar(cliente_id: number, dados: NovoPedido) {
        const conexao = await db.getConnection();

        try {
            await conexao.beginTransaction();

            const precos = new Map<number, number>();

            for (const item of dados.itens) {
                const produto = await PedidoRepository.BuscarProduto(conexao, item.produto_id);

                if (!produto) {
                    throw criarErro(`Produto ${item.produto_id} não encontrado.`, 404);
                }

                if (!produto.ativo) {
                    throw criarErro(`O produto "${produto.nome}" não está mais disponível. Remova-o do carrinho.`, 409);
                }

                // Não informa o número: a quantidade em estoque é só do administrador.
                if (item.quantidade > produto.quantidade_estoque) {
                    throw criarErro(
                        `No momento não temos essa quantidade de "${produto.nome}". ` +
                            "Diminua a quantidade ou fale com a loja pelo WhatsApp.",
                        409
                    );
                }

                precos.set(produto.id, Number(produto.preco_unitario));
            }

            const pedidoId = await PedidoRepository.Inserir(
                conexao,
                cliente_id,
                dados.previsao_busca,
                dados.observacao
            );

            for (const item of dados.itens) {
                await PedidoRepository.InserirItem(
                    conexao,
                    pedidoId,
                    item.produto_id,
                    item.quantidade,
                    precos.get(item.produto_id)!
                );
            }

            await conexao.commit();

            return pedidoId;

        } catch (error) {
            await conexao.rollback();
            throw error;
        } finally {
            conexao.release();
        }
    },

    // Administrador muda o status, seguindo o fluxo:
    // - confirmar: baixa o estoque de cada produto (saída);
    // - cancelar depois de confirmado: devolve o estoque (entrada);
    // - entregar: registra a venda E a nota fiscal (não existe venda sem nota).
    // Tudo numa transação só: se um passo falhar, nada é gravado.
    // `usuarioId` = administrador que mudou o status (vira o responsável nas movimentações).
    // `notaNumero` = número da nota fiscal (obrigatório para 'entregue'; o Zod também confere).
    async AlterarStatus(id: number, novoStatus: StatusPedido, usuarioId: number, notaNumero: string | null = null) {
        const conexao = await db.getConnection();

        try {
            await conexao.beginTransaction();

            const pedido = await PedidoRepository.BuscarParaAtualizar(conexao, id);

            if (!pedido) {
                throw criarErro("Pedido não encontrado.", 404);
            }

            const statusAnterior = pedido.status;

            if (!PROXIMOS_STATUS[statusAnterior].includes(novoStatus)) {
                throw criarErro(
                    `Não é possível mudar o pedido de "${NOME_STATUS[statusAnterior]}" para "${NOME_STATUS[novoStatus]}".`,
                    409
                );
            }

            const itens = await PedidoRepository.ListarItensParaEstoque(conexao, id);

            if (novoStatus === "confirmado") {
                for (const item of itens) {
                    try {
                        await EstoqueService.RegistrarMovimentacao(
                            "saida",
                            item.produto_id,
                            item.quantidade,
                            { usuarioId, pedidoId: id, motivo: `Confirmação do pedido nº ${id}` },
                            conexao
                        );
                    } catch (erro) {
                        if (temStatus(erro, 409)) {
                            throw criarErro(`"${item.produto_nome}": ${(erro as Error).message}`, 409);
                        }
                        throw erro;
                    }
                }
            }

            if (novoStatus === "cancelado" && STATUS_COM_ESTOQUE_BAIXADO.includes(statusAnterior)) {
                for (const item of itens) {
                    await EstoqueService.RegistrarMovimentacao(
                        "entrada",
                        item.produto_id,
                        item.quantidade,
                        { usuarioId, pedidoId: id, motivo: `Cancelamento do pedido nº ${id} (estoque devolvido)` },
                        conexao
                    );
                }
            }

            if (novoStatus === "entregue") {
                if (!notaNumero) {
                    throw criarErro("Informe o número da nota fiscal para marcar o pedido como entregue.", 400);
                }

                const venda = await VendaService.RegistrarNaTransacao(conexao, id);

                await NotaService.RegistrarNaTransacao(conexao, {
                    venda_id: venda.vendaId,
                    numero: notaNumero,
                    natureza_operacao: NATUREZA_PADRAO,
                    link_pdf: null
                });
            }

            await PedidoRepository.AtualizarStatus(conexao, id, novoStatus);

            await conexao.commit();

            return { id, status_anterior: statusAnterior, status: novoStatus };

        } catch (error) {
            await conexao.rollback();
            throw error;
        } finally {
            conexao.release();
        }
    }
};

export default PedidoService;
