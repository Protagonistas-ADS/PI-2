import db from "../configs/db";
import PedidoRepository, { type Pedido, type ItemPedido } from "../repositories/pedido.repository";
import EstoqueService from "./estoque.service";
import VendaService from "./venda.service";
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

                if (item.quantidade > produto.quantidade_estoque) {
                    throw criarErro(
                        `Estoque insuficiente para "${produto.nome}". Disponível: ${produto.quantidade_estoque}.`,
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
    // - entregar: registra a venda.
    // Tudo numa transação só: se um passo falhar, nada é gravado.
    async AlterarStatus(id: number, novoStatus: StatusPedido) {
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
                        await EstoqueService.RegistrarMovimentacao("saida", item.produto_id, item.quantidade, null, conexao);
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
                    await EstoqueService.RegistrarMovimentacao("entrada", item.produto_id, item.quantidade, null, conexao);
                }
            }

            if (novoStatus === "entregue") {
                await VendaService.RegistrarNaTransacao(conexao, id);
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
