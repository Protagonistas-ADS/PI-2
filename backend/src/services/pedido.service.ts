import PedidoRepository from "../repositories/pedido.repository";
import { criarErro } from "../utils/criarErro";

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
            throw criarErro(
                "Pedido não encontrado ou não pode ser cancelado.",
                404
            );
        }

        return { mensagem: "Pedido cancelado com sucesso." };
    }

};

export default PedidoService;