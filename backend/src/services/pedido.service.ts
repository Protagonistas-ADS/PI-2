import PedidoRepository from "../repositories/pedido.repository";

const PedidoService = {

    async ListarDoCliente(id: number) {
        const pedidos = await PedidoRepository.ListarDoCliente(id);

        return pedidos;
    }

};

export default PedidoService;