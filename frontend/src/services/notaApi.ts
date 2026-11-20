import api from "./api";
import type { NotaFiscal, NovaNota } from "../types/nota";

// Tudo aqui é só para administrador

export async function listarNotas(): Promise<NotaFiscal[]> {
    const response = await api.get("/notas");
    return response.data.notas;
}

export async function registrarNota(dados: NovaNota) {
    const response = await api.post("/notas", dados);
    return response.data;
}

export async function cancelarNota(id: number) {
    await api.patch(`/notas/${id}/cancelar`);
}

// Trocar o link do PDF (null apaga o link)
export async function atualizarLinkNota(id: number, linkPdf: string | null) {
    await api.patch(`/notas/${id}/link`, { link_pdf: linkPdf });
}
