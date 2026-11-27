import { z } from "zod";
import { NumeroNotaSchema } from "./nota.schema";

// Fluxo do pedido: pendente -> confirmado -> pronto_retirada -> entregue (ou cancelado).
// Mesmos valores do ENUM da coluna pedido.status no banco.
export const STATUS_PEDIDO = ["pendente", "confirmado", "pronto_retirada", "entregue", "cancelado"] as const;
export type StatusPedido = typeof STATUS_PEDIDO[number];

// Quantos dias para frente o cliente pode marcar a retirada
export const DIAS_MAXIMOS_RETIRADA = 60;

// Data de hoje no fuso do servidor, no formato "AAAA-MM-DD"
function dataLocal(dias = 0) {
    const data = new Date();
    data.setDate(data.getDate() + dias);

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

// "2026-02-31" passa na regex, mas não existe: confere se a data é real
function dataExiste(texto: string) {
    const [ano = 0, mes = 0, dia = 0] = texto.split("-").map(Number);
    const data = new Date(ano, mes - 1, dia);

    return data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
}

const ItemPedidoSchema = z.object({
    produto_id: z.number({ error: "Informe o produto." })
        .int("Identificação de produto inválida.")
        .positive("Identificação de produto inválida."),
    quantidade: z.number({ error: "A quantidade deve ser um número." })
        .int("A quantidade deve ser um número inteiro.")
        .positive("A quantidade deve ser maior que zero.")
        .max(100000, "A quantidade está acima do permitido.")
});

// Corpo de POST /pedidos
export const CriarPedidoSchema = z.object({
    itens: z.array(ItemPedidoSchema, { error: "Informe os produtos do pedido." })
        .min(1, "O pedido precisa ter pelo menos um produto.")
        .max(50, "O pedido pode ter no máximo 50 produtos diferentes.")
        .refine(
            (itens) => new Set(itens.map((item) => item.produto_id)).size === itens.length,
            "Não é permitido repetir produtos no pedido."
        ),

    // Data prevista para retirar na loja (opcional), no formato "AAAA-MM-DD"
    previsao_busca: z.string({ error: "Informe a data no formato AAAA-MM-DD." })
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data no formato AAAA-MM-DD.")
        .refine(dataExiste, "Essa data não existe.")
        .refine((data) => data >= dataLocal(), "A data de retirada não pode ser no passado.")
        .refine(
            (data) => data <= dataLocal(DIAS_MAXIMOS_RETIRADA),
            `A data de retirada deve ser em até ${DIAS_MAXIMOS_RETIRADA} dias.`
        )
        .nullable()
        .optional()
        .transform((data) => data ?? null),

    // Recado para a loja (opcional). Texto vazio vira null.
    observacao: z.string({ error: "A observação deve ser um texto." })
        .trim()
        .max(500, "A observação deve ter no máximo 500 caracteres.")
        .nullable()
        .optional()
        .transform((texto) => texto ? texto : null)
});

export type NovoPedido = z.infer<typeof CriarPedidoSchema>;
export type NovoItemPedido = NovoPedido["itens"][number];

// Corpo de PATCH /pedidos/:id/status (só administrador).
// 'pendente' fica de fora: nenhum pedido volta para o começo.
// Para 'entregue', o número da nota fiscal é OBRIGATÓRIO: não existe venda sem nota.
export const AlterarStatusPedidoSchema = z.object({
    status: z.enum(["confirmado", "pronto_retirada", "entregue", "cancelado"], {
        error: "Status inválido. Use: confirmado, pronto_retirada, entregue ou cancelado."
    }),
    nota_numero: NumeroNotaSchema.optional()
}).refine(
    (dados) => dados.status !== "entregue" || Boolean(dados.nota_numero),
    { message: "Informe o número da nota fiscal para marcar o pedido como entregue.", path: ["nota_numero"] }
);
