import { z } from "zod";

// Mesmos valores do ENUM da coluna nota.status no banco
export const STATUS_NOTA = ["emitida", "cancelada"] as const;
export type StatusNota = typeof STATUS_NOTA[number];

export const NATUREZA_PADRAO = "Venda de mercadoria";

// Só aceita endereço http:// ou https:// (bloqueia "javascript:..." e afins,
// que poderiam rodar código quando o admin clicasse no link)
function linkSeguro(texto: string) {
    try {
        const endereco = new URL(texto);
        return endereco.protocol === "http:" || endereco.protocol === "https:";
    } catch {
        return false;
    }
}

// Link do PDF no Emitte (opcional). Texto vazio vira null.
const LinkPdfSchema = z.preprocess(
    (valor) => (typeof valor === "string" && valor.trim() === "" ? null : valor),
    z.string({ error: "O link deve ser um texto." })
        .trim()
        .max(500, "O link deve ter no máximo 500 caracteres.")
        .refine(linkSeguro, "Informe um link válido, começando com http:// ou https://.")
        .nullable()
        .optional()
).transform((valor) => valor ?? null);

// Corpo de POST /notas (só administrador)
export const CriarNotaSchema = z.object({
    venda_id: z.number({ error: "Informe a venda." })
        .int("Identificação da venda inválida.")
        .positive("Identificação da venda inválida."),

    numero: z.string({ error: "Informe o número da nota fiscal." })
        .trim()
        .min(1, "Informe o número da nota fiscal.")
        .max(30, "O número da nota deve ter no máximo 30 caracteres.")
        .regex(/^[A-Za-z0-9./-]+$/, "Use só letras, números, ponto, barra ou hífen no número da nota."),

    natureza_operacao: z.string({ error: "A natureza da operação deve ser um texto." })
        .trim()
        .max(100, "A natureza da operação deve ter no máximo 100 caracteres.")
        .nullable()
        .optional()
        .transform((texto) => texto ? texto : NATUREZA_PADRAO),

    link_pdf: LinkPdfSchema
});

export type NovaNota = z.infer<typeof CriarNotaSchema>;

// Corpo de PATCH /notas/:id/link (só administrador): trocar ou apagar o link (null)
export const AtualizarLinkNotaSchema = z.object({
    link_pdf: LinkPdfSchema
});
