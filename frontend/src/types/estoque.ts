// Mesmos nomes que a API devolve em /estoque (tabelas produto e movimentacao_estoque).

export type TipoMovimentacao = "entrada" | "saida";

// GET /estoque: saldo de cada produto
export interface SaldoProduto {
    readonly id: number;
    nome: string;
    quantidade_estoque: number;
    ativo: boolean | number;
}

// GET /estoque/movimentacoes
export interface Movimentacao {
    readonly id: number;
    produto_id: number;
    produto_nome: string;
    pedido_id: number | null;        // null = movimentação manual
    usuario_id: number | null;
    responsavel_nome: string | null; // null = registro antigo, de antes da migração
    tipo: TipoMovimentacao;
    quantidade: number;
    motivo: string | null;
    data_mov: string;
}

// Corpo de POST /estoque/entrada e /estoque/saida
export interface NovaMovimentacao {
    produto_id: number;
    quantidade: number;
    motivo: string;
}

// Resposta de POST /estoque/entrada e /estoque/saida
export interface ResultadoMovimentacao {
    movimentacao_id: number;
    produto_id: number;
    tipo: TipoMovimentacao;
    quantidade: number;
    motivo: string;
    saldo_anterior: number;
    saldo_atual: number;
}
