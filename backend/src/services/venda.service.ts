
import db from "../configs/db";
import VendaRepository from "../repositories/venda.repository";
import EstoqueService from "./estoque.service";
import { criarErro } from "../utils/criarErro";

const VendaService = {

    async Criar(pedidoId: number) {

        if (!Number.isInteger(pedidoId) || pedidoId <= 0) {
            throw criarErro("Identificação do pedido inválida.", 400);
        }

        const conexao = await db.getConnection();

        try {
            await conexao.beginTransaction();

            // 1. Busca e bloqueia o pedido
            const pedido = await VendaRepository.BuscarPedido(conexao, pedidoId);

            if (!pedido) {
                throw criarErro("Pedido não encontrado.", 404);
            }

            const vendaExistente = await VendaRepository.BuscarVendaPorPedido(
                conexao,
                pedidoId
            );

            if (vendaExistente) {
                throw criarErro("Este pedido já possui uma venda registrada.", 409);
            }

            if (pedido.status !== "respondido") {
                throw criarErro("Somente pedidos respondidos podem ser vendidos.", 409);
            }
            // 4. Busca os produtos do pedido
            const itens = await VendaRepository.BuscarItensPedido(
                conexao,
                pedidoId
            );

            if (itens.length === 0) {
                throw criarErro("O pedido não possui produtos.", 400);
            }

            // 5. Calcula o valor total
            const valorTotal = itens.reduce((total, item) => {
                return total + Number(item.preco_unitario) * item.quantidade;
            }, 0);

            // 6. Registra a venda
            const resultadoVenda = await VendaRepository.Criar(
                conexao,
                pedidoId,
                valorTotal
            );

            // 7. Registra a saída de cada produto do estoque
            for (const item of itens) {
                await EstoqueService.RegistrarMovimentacao(
                    "saida",
                    item.produto_id,
                    item.quantidade,
                    null,
                    conexao
                );
            }

            // 8. Confirma todas as operações
            await conexao.commit();

            return {
                vendaId: resultadoVenda.insertId,
                pedidoId,
                valorTotal
            };

        } catch (error) {
            await conexao.rollback();
            throw error;

        } finally {
            conexao.release();
        }
    }

};

export default VendaService;
