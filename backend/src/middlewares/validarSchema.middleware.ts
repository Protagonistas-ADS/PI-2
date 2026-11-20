import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

// origem "body": valida o corpo da requisição e troca pelos dados já limpos (trim etc.).
// origem "params": só confere os parâmetros da URL (ex.: :id); o controller converte depois.
export function validarSchema(schema: ZodType, origem: "body" | "params" = "body") {
    return (req: Request, res: Response, next: NextFunction) => {
        const resultado = schema.safeParse(req[origem]);

        if (!resultado.success) {
            return next(resultado.error);
        }

        if (origem === "body") {
            req.body = resultado.data;
        }

        next();
    }
}
