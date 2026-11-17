import api from "./api";

export async function listarCotacoesCliente() {
    const response = await api.get("/cotacoes/cliente");
    return response.data.cotacoes;
}

export async function listarItensCotacao(id: number) {
    const response = await api.get(`/cotacoes/itens/${id}`);
    return response.data;
}
