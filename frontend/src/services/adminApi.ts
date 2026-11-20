import api from "./api";
import type { ResumoDashboard, UsuarioAdmin } from "../types/admin";

// Números do painel do administrador
export async function buscarResumoDashboard(): Promise<ResumoDashboard> {
    const response = await api.get("/admin/resumo");
    return response.data;
}

// Tabela de usuários do painel (a senha nunca vem)
export async function listarUsuarios(): Promise<UsuarioAdmin[]> {
    const response = await api.get("/admin/usuarios");
    return response.data.usuarios;
}
