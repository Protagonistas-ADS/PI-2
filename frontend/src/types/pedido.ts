// Mesmos nomes e tipos que a API devolve em /pedidos (tabela pedido no banco).

// Fluxo: pendente -> confirmado -> pronto_retirada -> entregue (ou cancelado)
export type StatusPedido = "pendente" | "confirmado" | "pronto_retirada" | "entregue" | "cancelado";

export const NOME_STATUS_PEDIDO: Record<StatusPedido, string> = {
    pendente: "Aguardando confirmação",
    confirmado: "Confirmado",
    pronto_retirada: "Pronto para retirada",
    entregue: "Entregue",
    cancelado: "Cancelado"
};

export interface Pedido {
    readonly id: number;
    status: StatusPedido;
    previsao_busca: string | null; // data (ISO) em que o cliente pretende retirar
    observacao: string | null;
    criado_em: string;
    quantidade_total: number;
    valor_total: number;
}

export interface ItemPedido {
    produto_id: number;
    produto_nome: string;
    quantidade: number;
    preco_unitario: number;
    subtotal: number;
}

// Corpo de POST /pedidos
export interface NovoPedido {
    itens: { produto_id: number; quantidade: number }[];
    previsao_busca: string | null; // "AAAA-MM-DD"
    observacao: string | null;
}

// GET /pedidos (só administrador): pedido com os dados do cliente
export interface PedidoComCliente extends Pedido {
    cliente_id: number;
    cliente_nome: string;
    cliente_email: string;
}

// Corpo de PATCH /pedidos/:id/status ('pendente' não volta)
export type NovoStatusPedido = Exclude<StatusPedido, "pendente">;
