import { z } from "zod";

export const MovimentacaoEstoqueSchema = z.object({
    produto_id: z.number().int().positive("Informe um produto válido."),
    quantidade: z.number()
        .int("A quantidade deve ser um número inteiro.")
        .positive("A quantidade deve ser maior que zero.")
        .max(1000000, "A quantidade máxima por movimentação é 1.000.000.")
});
