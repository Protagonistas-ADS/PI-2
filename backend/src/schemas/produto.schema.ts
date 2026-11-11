import { z } from "zod";

export const ProdutoSchema = z.object({
    nome: z.string().min(2, "O nome deve ter no mínimo 2 caracteres."),
    descricao: z.string().min(10, "A descrição deve ter ao menos 10 caracteres."),
    preco: z.number().positive("O preço deve ser um valor positivo."),
    quantidade: z.number().int().nonnegative("A quantidade deve ser um número inteiro não negativo.")
});