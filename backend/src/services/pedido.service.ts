import PedidoRepository from "../repositories/pedido.repository";
import { criarErro } from "../utils/criarErro";
import type { NovoItemPedido } from "../repositories/pedido.repository";

const PedidoService = {

    async ListarPorCliente(id: number) {
        if (!id) {
            throw criarErro("Identificação do cliente não informada.", 400);
        }

        const pedidos = await PedidoRepository.ListarPorCliente(id);
        return pedidos;
    },

    async ListarItens(id: number, clienteId: number) {
        if (!id || !clienteId) {
            throw criarErro("Identificação do pedido ou cliente não informada.", 400);
        }

        const produtos = await PedidoRepository.ListarItens(id, clienteId);

        if (produtos.length === 0) {
            throw criarErro("Pedido não encontrado ou sem produtos.", 404);
        }

        return produtos;
    },

    async Cancelar(id: number, clienteId: number) {
        if (!id || !clienteId) {
            throw criarErro("Identificação do pedido ou cliente não informada.", 400);
        }

        const resultado = await PedidoRepository.Cancelar(id, clienteId);

        if (resultado.affectedRows === 0) {
            throw criarErro("Pedido não encontrado ou não pode ser cancelado.", 404);
        }
    },

    async Criar(clienteId: number, itens: NovoItemPedido[]) {
        if (!Number.isInteger(clienteId) || clienteId <= 0) {
            throw criarErro("Identificação do cliente inválida.", 400);
        }

        if (!Array.isArray(itens) || itens.length === 0) {
            throw criarErro("O pedido precisa ter pelo menos um produto.", 400);
        }

        const idsProdutos = itens.map((item) => item.produtoId);

        if (new Set(idsProdutos).size !== idsProdutos.length) {
            throw criarErro("Não é permitido repetir produtos no pedido.", 400);
        }

        for (const item of itens) {
            if (!Number.isInteger(item.produtoId) || item.produtoId <= 0) {
                throw criarErro("Identificação de produto inválida.", 400);
            }

            if (!Number.isInteger(item.quantidade) || item.quantidade <= 0) {
                throw criarErro("A quantidade deve ser um número inteiro positivo.", 400);
            }
        }

        const pedidoId = await PedidoRepository.Criar(clienteId, itens);

        return pedidoId;
    }
};

export default PedidoService;