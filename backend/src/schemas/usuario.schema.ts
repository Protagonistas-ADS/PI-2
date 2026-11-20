import { z } from "zod";

// E-mail: tira espaços das pontas e guarda em minúsculas antes de validar.
// Aceita qualquer domínio (gmail, hotmail, outlook, .com.br, .gov.br, empresa etc.).
const EmailSchema = z.string({ error: "O e-mail é obrigatório." })
    .trim()
    .toLowerCase()
    .min(1, "O e-mail é obrigatório.")
    .max(255, "O e-mail deve ter no máximo 255 caracteres.")
    .email("Informe um e-mail válido, como nome@exemplo.com.");

export const CadastroSchema = z.object({
    nome: z.string({ error: "O nome é obrigatório." }).trim().min(2, "O nome deve ter ao menos 2 caracteres."),
    email: EmailSchema,
    senha: z.string({ error: "A senha é obrigatória." }).min(6, "A senha deve conter ao menos 6 caracteres.")
});

export const LoginSchema = z.object({
    email: EmailSchema,
    senha: z.string({ error: "A senha é obrigatória." }).min(1, "A senha é obrigatória.")
});

export const AtualizarSchema = z.object({
    nome: z.string().trim().min(2, "O nome deve ter ao menos 2 caracteres.").optional(),
    senhaAtual: z.string().min(6, "A senha atual precisa ter no mínimo 6 caracteres").optional(),
    senhaNova: z.string().min(6, "A senha nova precisa ter no mínimo 6 caracteres").optional(),
}).refine(
    (dados) => dados.nome !== undefined || dados.senhaAtual !== undefined || dados.senhaNova !== undefined,
    { message: "Informe pelo menos um dado para atualizar" }
)