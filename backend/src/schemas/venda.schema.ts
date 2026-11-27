import { z } from "zod";
import { NumeroNotaSchema } from "./nota.schema";

// Corpo de POST /vendas (só administrador).
// Toda venda nasce com nota fiscal: o número da nota é obrigatório.
export const CriarVendaSchema = z.object({
    pedido_id: z.number({ error: "Informe o número do pedido." })
        .int("Identificação do pedido inválida.")
        .positive("Identificação do pedido inválida."),

    nota_numero: NumeroNotaSchema
});
