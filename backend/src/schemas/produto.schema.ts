import { z } from "zod";

// Dados de um produto (usado para cadastrar e para editar).
// Os limites seguem a tabela produto do banco (VARCHAR(255) e DECIMAL(10,2)).
export const ProdutoSchema = z.object({
    nome: z.string({ error: "O nome é obrigatório." })
        .trim()
        .min(2, "O nome deve ter no mínimo 2 caracteres.")
        .max(255, "O nome deve ter no máximo 255 caracteres."),
    descricao: z.string({ error: "A descrição é obrigatória." })
        .trim()
        .min(10, "A descrição deve ter ao menos 10 caracteres.")
        .max(255, "A descrição deve ter no máximo 255 caracteres."),
    preco: z.number({ error: "O preço deve ser um número." })
        .positive("O preço deve ser um valor positivo.")
        .max(99999999.99, "O preço está acima do permitido."),
    quantidade: z.number({ error: "A quantidade deve ser um número." })
        .int("A quantidade deve ser um número inteiro.")
        .nonnegative("A quantidade não pode ser negativa."),
    // Nome do arquivo dentro de backend/uploads (ex.: "palete-pbr.png"). Opcional.
    imagem: z.string()
        .trim()
        .max(255, "O nome da imagem deve ter no máximo 255 caracteres.")
        .nullable()
        .optional()
});

// Ativar ou desativar um produto (ele some do catálogo, mas continua nos pedidos antigos).
export const AlterarAtivoSchema = z.object({
    ativo: z.boolean({ error: "Informe se o produto fica ativo (true) ou inativo (false)." })
});

// O :id da URL precisa ser um número inteiro positivo.
export const IdParamSchema = z.object({
    id: z.coerce.number({ error: "O id deve ser um número." })
        .int("O id deve ser um número inteiro.")
        .positive("O id deve ser maior que zero.")
});
