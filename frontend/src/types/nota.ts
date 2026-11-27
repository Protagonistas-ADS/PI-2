// Mesmos nomes que a API devolve em /notas (tabela nota no banco).

export type StatusNota = "emitida" | "cancelada";

export const NOME_STATUS_NOTA: Record<StatusNota, string> = {
    emitida: "Emitida",
    cancelada: "Cancelada"
};

// GET /notas
export interface NotaFiscal {
    readonly id: number;
    venda_id: number;
    pedido_id: number;
    cliente_nome: string;
    numero: string;
    natureza_operacao: string;
    valor_total: number;
    status: StatusNota;
    link_pdf: string | null; // endereço do PDF no Emitte
    data_emissao: string;
}

// Corpo de POST /notas (nota substituta de uma nota cancelada)
export interface NovaNota {
    venda_id: number;
    numero: string;
    natureza_operacao: string | null;
    link_pdf?: string | null; // opcional: o link pode ser adicionado depois, na tela de Notas
}
