import { z } from "zod";

export const CadastroSchema = z.object({
    nome: z.string().min(2, "O nome deve ter ao menos 2 caracteres."),
    email: z.string().min(1, "O email é obrigatório").email(),
    senha: z.string().min(6, "A senha deve conter ao menos 6 caracteres.")
});

export const LoginSchema = z.object({
    email: z.string().min(1, "O email é obrigatório").email(),
    senha: z.string().min(1, "A senha é obrigatória")
});

export const AtualizarSchema = z.object({
    nome: z.string().min(2, "O nome deve ter ao menos 2 caracteres.").optional(),
    senhaAtual: z.string().min(6, "A senha atual precisa ter no mínimo 6 caracteres").optional(),
    senhaNova: z.string().min(6, "A senha nova precisa ter no mínimo 6 caracteres").optional(),
}).refine(
    (dados) => dados.nome !== undefined || dados.senhaAtual !== undefined || dados.senhaNova !== undefined,
    { message: "Informe pelo menos um dado para atualizar" }
)