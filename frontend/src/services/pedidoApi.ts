import api from "./api";

export async function listarPedidosCliente() {
    const response = await api.get("/pedidos/cliente") 
    return response.data.pedidos;
} 

export async function listarItensPedido(id: number) {
    const response = await api.get(`/pedidos/itens/${id}`);
    return response.data.produtos;
}

export async function cancelarPedido(id: number) {
    const response = await api.patch(`/pedidos/cancelar/${id}`);
    return response.data;
}
