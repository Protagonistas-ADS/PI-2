import api from "./api";
import type { Pedido, PedidoComCliente, ItemPedido, NovoPedido, NovoStatusPedido } from "../types/pedido";

export async function criarPedido(dados: NovoPedido): Promise<number> {
    const response = await api.post("/pedidos", dados);
    return response.data.pedidoId;
}

export async function listarPedidosCliente(): Promise<Pedido[]> {
    const response = await api.get("/pedidos/cliente");
    return response.data.pedidos;
}

export async function listarItensPedido(id: number): Promise<ItemPedido[]> {
    const response = await api.get(`/pedidos/itens/${id}`);
    return response.data.produtos;
}

export async function cancelarPedido(id: number) {
    await api.patch(`/pedidos/cancelar/${id}`);
}

// ---- Administrador ----

export async function listarTodosPedidos(): Promise<PedidoComCliente[]> {
    const response = await api.get("/pedidos");
    return response.data.pedidos;
}

export async function listarItensPedidoAdmin(id: number): Promise<ItemPedido[]> {
    const response = await api.get(`/pedidos/${id}/itens`);
    return response.data.produtos;
}

export async function alterarStatusPedido(id: number, status: NovoStatusPedido) {
    await api.patch(`/pedidos/${id}/status`, { status });
}
