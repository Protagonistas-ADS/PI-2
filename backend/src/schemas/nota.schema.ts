import { z } from "zod";

// Mesmos valores do ENUM da coluna nota.status no banco
export const STATUS_NOTA = ["emitida", "cancelada"] as const;
export type StatusNota = typeof STATUS_NOTA[number];

export const NATUREZA_PADRAO = "Venda de mercadoria";

// Número da nota fiscal (mesma regra ao emitir nota e ao entregar o pedido)
export const NumeroNotaSchema = z.string({ error: "Informe o número da nota fiscal." })
    .trim()
    .min(1, "Informe o número da nota fiscal.")
    .max(30, "O número da nota deve ter no máximo 30 caracteres.")
    .regex(/^[A-Za-z0-9./-]+$/, "Use só letras, números, ponto, barra ou hífen no número da nota.");

// Corpo de POST /notas (só administrador): nota substituta de uma nota cancelada
export const CriarNotaSchema = z.object({
    venda_id: z.number({ error: "Informe a venda." })
        .int("Identificação da venda inválida.")
        .positive("Identificação da venda inválida."),

    numero: NumeroNotaSchema,

    natureza_operacao: z.string({ error: "A natureza da operação deve ser um texto." })
        .trim()
        .max(100, "A natureza da operação deve ter no máximo 100 caracteres.")
        .nullable()
        .optional()
        .transform((texto) => texto ? texto : NATUREZA_PADRAO)
});

export type NovaNota = z.infer<typeof CriarNotaSchema>;
