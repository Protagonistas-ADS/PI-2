import { z } from "zod";

// Corpo de POST /vendas (só administrador)
export const CriarVendaSchema = z.object({
    pedido_id: z.number({ error: "Informe o número do pedido." })
        .int("Identificação do pedido inválida.")
        .positive("Identificação do pedido inválida.")
});
