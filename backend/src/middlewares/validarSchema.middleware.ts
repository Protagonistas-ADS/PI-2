import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export function validarSchema(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        const resultado = schema.safeParse(req.body);

        if (!resultado.success) {
            return next(resultado.error);
        }

        req.body = resultado.data;

        next();
    }
}