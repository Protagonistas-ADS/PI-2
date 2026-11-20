import api from "./api";
import type { Venda } from "../types/venda";

// Tabela de vendas do painel (só administrador)
export async function listarVendas(): Promise<Venda[]> {
    const response = await api.get("/vendas");
    return response.data.vendas;
}
