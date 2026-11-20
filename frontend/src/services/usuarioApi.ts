import api from "./api";
import type { UsuarioLogado } from "../types/usuario";

interface CadastroUsuario {
    nome: string;
    email: string;
    senha: string;
}

interface LoginUsuario {
    email: string;
    senha: string;
}

interface DadosAtualizacao {
    nome?: string;
    senhaAtual?: string;
    senhaNova?: string;
}

export async function cadastrarUsuario(dados: CadastroUsuario) {
    const response = await api.post("/usuarios", dados);

    return response.data;
}

export async function autenticarLogin(dados: LoginUsuario) {
    const response = await api.post("/usuarios/login", dados);

    return response.data;
}

export async function buscarUsuarioLogado(): Promise<UsuarioLogado> {
    const response = await api.get("/usuarios/logado");

    return response.data.usuario;
}

export async function atualizarUsuario(dados: DadosAtualizacao) {
    const response = await api.patch("/usuarios", dados);

    return response.data;
}