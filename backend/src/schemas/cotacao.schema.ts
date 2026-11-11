
import { z } from "zod";

const ItemCotacaoSchema = z.object({
    lote_id: z.number().int().positive(),
    quantidade: z.number().int().positive()
});

export const CriarCotacaoSchema = z.object({
    cliente_id: z.number().int().positive().optional(),
    validade: z.string().datetime().optional(),
    itens: z.array(ItemCotacaoSchema).min(1, "A cotação deve possuir pelo menos um produto.")
});

export const EditarCotacaoSchema = z.object({
    validade: z.string().datetime().nullable().optional(),

    status: z.enum([
        "pendente",
        "respondida",
        "convertida",
        "recusada",
        "cancelada",
        "expirada"
    ]).optional(),

    itens: z.array(ItemCotacaoSchema).min(1).optional()
}).refine(
    (dados) => Object.keys(dados).length > 0,
    "Informe pelo menos um campo para editar."
);

export const IdCotacaoSchema = z.object({
    id: z.coerce.number().int().positive()
});
