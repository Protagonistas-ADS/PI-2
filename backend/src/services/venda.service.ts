import type { PoolConnection } from "mysql2/promise";
import db from "../configs/db";
import VendaRepository from "../repositories/venda.repository";
import NotaService from "./nota.service";
import { NATUREZA_PADRAO } from "../schemas/nota.schema";
import { criarErro } from "../utils/criarErro";

// A venda nasce quando o pedido é entregue.
// O estoque NÃO baixa aqui: ele já baixou quando o administrador confirmou o pedido.
const VendaService = {

    // GET /vendas: tabela de vendas do painel (o MySQL devolve DECIMAL e SUM como texto)
    async ListarTodas() {
        const vendas = await VendaRepository.ListarTodas();

        return vendas.map((venda) => ({
            id: venda.id,
            pedido_id: venda.pedido_id,
            valor_total: Number(venda.valor_total),
            data_venda: venda.data_venda,
            cliente_id: venda.cliente_id,
            cliente_nome: venda.cliente_nome,
            cliente_email: venda.cliente_email,
            quantidade_total: Number(venda.quantidade_total),
            nota_id: venda.nota_id,
            nota_numero: venda.nota_numero
        }));
    },

    // Registra a venda usando a transação de quem chamou
    // (ex.: PedidoService ao marcar o pedido como entregue).
    async RegistrarNaTransacao(conexao: PoolConnection, pedidoId: number) {
        const vendaExistente = await VendaRepository.BuscarVendaPorPedido(conexao, pedidoId);

        if (vendaExistente) {
            throw criarErro("Este pedido já possui uma venda registrada.", 409);
        }

        const itens = await VendaRepository.BuscarItensPedido(conexao, pedidoId);

        if (itens.length === 0) {
            throw criarErro("O pedido não possui produtos.", 400);
        }

        const valorTotal = itens.reduce((total, item) => {
            return total + Number(item.preco_unitario) * item.quantidade;
        }, 0);

        const resultadoVenda = await VendaRepository.Criar(conexao, pedidoId, valorTotal);

        return {
            vendaId: resultadoVenda.insertId,
            pedidoId,
            valorTotal
        };
    },

    // POST /vendas: registra a venda (com a nota fiscal) de um pedido já entregue que ficou sem venda
    // (ex.: pedidos antigos). Pedidos entregues pelo sistema já ganham a venda sozinhos.
    async Criar(pedidoId: number, notaNumero: string) {
        const conexao = await db.getConnection();

        try {
            await conexao.beginTransaction();

            const pedido = await VendaRepository.BuscarPedido(conexao, pedidoId);

            if (!pedido) {
                throw criarErro("Pedido não encontrado.", 404);
            }

            if (pedido.status !== "entregue") {
                throw criarErro("Somente pedidos entregues podem virar venda.", 409);
            }

            const resultado = await VendaService.RegistrarNaTransacao(conexao, pedidoId);

            const nota = await NotaService.RegistrarNaTransacao(conexao, {
                venda_id: resultado.vendaId,
                numero: notaNumero,
                natureza_operacao: NATUREZA_PADRAO
            });

            await conexao.commit();

            return { ...resultado, notaId: nota.nota_id, notaNumero: nota.numero };

        } catch (error) {
            await conexao.rollback();
            throw error;

        } finally {
            conexao.release();
        }
    }

};

export default VendaService;
