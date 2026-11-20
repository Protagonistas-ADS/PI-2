// Mesmos nomes que a API devolve em GET /admin/resumo.

export interface ProdutoEstoqueBaixo {
    readonly id: number;
    nome: string;
    quantidade_estoque: number;
}

export interface ResumoDashboard {
    pendentes: number;
    retirar_hoje: number;
    limite_estoque_baixo: number;
    estoque_baixo: ProdutoEstoqueBaixo[];
    vendas_mes: {
        quantidade: number;
        valor_total: number;
    };
}

// GET /admin/usuarios: usuário sem a senha, com o resumo das compras
export type PerfilUsuario = "cliente" | "administrador";

export interface UsuarioAdmin {
    readonly id: number;
    nome: string;
    email: string;
    perfil: PerfilUsuario;
    criado_em: string;
    total_pedidos: number;
    total_comprado: number; // soma das vendas (pedidos entregues)
}
