import { z } from "zod";

// O :id da URL precisa ser um número inteiro positivo (vale para todas as rotas).
export const IdParamSchema = z.object({
    id: z.coerce.number({ error: "O id deve ser um número." })
        .int("O id deve ser um número inteiro.")
        .positive("O id deve ser maior que zero.")
});
