import api from "./api";

interface CadastroUsuario {
    nome: string;
    email: string;
    senha: string;
}

interface LoginUsuario {
    email: string;
    senha: string;
}

export async function cadastrarUsuario(dados: CadastroUsuario) {
    const response = await api.post("/usuarios", dados);

    return response.data;
}

export async function autenticarLogin(dados: LoginUsuario) {
    const response = await api.post("/usuarios/login", dados);

    return response.data;
}

export async function buscarUsuarioLogado(token: string) {
    const response = await api.get("/usuarios/logado", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data.usuario;
}