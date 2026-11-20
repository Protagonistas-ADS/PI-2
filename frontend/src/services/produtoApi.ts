import api from "./api";
import type { Produto } from "../types/produto";

// Público: não precisa de login. Só vêm produtos ativos.
export async function listar(): Promise<Produto[]> {
    const response = await api.get("/produtos");
    return response.data.produtos;
}

// Público: detalhes de um produto ativo (404 se não existir ou estiver desativado).
export async function buscar(id: number): Promise<Produto> {
    const response = await api.get(`/produtos/${id}`);
    return response.data.produto;
}
