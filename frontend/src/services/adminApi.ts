import api from "./api";
import type { ResumoDashboard } from "../types/admin";

// Números do painel do administrador
export async function buscarResumoDashboard(): Promise<ResumoDashboard> {
    const response = await api.get("/admin/resumo");
    return response.data;
}
