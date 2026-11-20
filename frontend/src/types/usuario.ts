// Mesmos nomes da tabela usuario no banco e de GET /usuarios/logado.

export type PerfilUsuario = "cliente" | "administrador";

export interface UsuarioLogado {
    readonly id: number;
    nome: string;
    email: string;
    perfil: PerfilUsuario;
    criado_em: string; // data (ISO) do cadastro
}
