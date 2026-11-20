import api from "./api";
import type {
    SaldoProduto,
    Movimentacao,
    NovaMovimentacao,
    ResultadoMovimentacao,
    TipoMovimentacao
} from "../types/estoque";

// Tudo aqui é só para administrador

export async function listarSaldos(): Promise<SaldoProduto[]> {
    const response = await api.get("/estoque");
    return response.data.produtos;
}

export async function listarMovimentacoes(): Promise<Movimentacao[]> {
    const response = await api.get("/estoque/movimentacoes");
    return response.data.movimentacoes;
}

// Entrada ou saída manual (o responsável é o admin logado, pelo token)
export async function registrarMovimentacao(tipo: TipoMovimentacao, dados: NovaMovimentacao): Promise<ResultadoMovimentacao> {
    const response = await api.post(`/estoque/${tipo}`, dados);
    return response.data;
}
