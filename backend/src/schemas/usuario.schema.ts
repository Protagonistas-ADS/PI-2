import { z } from "zod";

export const CadastroSchema = z.object({
    nome: z.string().min(2, "O nome deve ter ao menos 2 caracteres."),
    email: z.string().min(1, "O email é obrigatório").email(),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.")
});
