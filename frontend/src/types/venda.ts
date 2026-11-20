// Mesmos nomes que a API devolve em GET /vendas (tabela venda + cliente + nota emitida).

export interface Venda {
    readonly id: number;
    pedido_id: number;
    valor_total: number;
    data_venda: string;
    cliente_id: number;
    cliente_nome: string;
    cliente_email: string;
    quantidade_total: number;
    nota_id: number | null;     // nota 'emitida' da venda (null = sem nota)
    nota_numero: string | null;
}
