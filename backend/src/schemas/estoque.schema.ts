import { z } from "zod";

// Corpo de POST /estoque/entrada e /estoque/saida (só administrador).
// O responsável não vem no corpo: é o administrador logado (pelo token).
export const MovimentacaoEstoqueSchema = z.object({
    produto_id: z.number({ error: "Informe o produto." })
        .int("Informe um produto válido.")
        .positive("Informe um produto válido."),
    quantidade: z.number({ error: "A quantidade deve ser um número." })
        .int("A quantidade deve ser um número inteiro.")
        .positive("A quantidade deve ser maior que zero.")
        .max(1000000, "A quantidade máxima por movimentação é 1.000.000."),
    motivo: z.string({ error: "Informe o motivo da movimentação." })
        .trim()
        .min(3, "Descreva o motivo com pelo menos 3 letras.")
        .max(255, "O motivo deve ter no máximo 255 caracteres.")
});
