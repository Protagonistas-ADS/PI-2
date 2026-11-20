import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function erroMiddleware(
    erro: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (erro instanceof ZodError) {
        return res.status(400).json({
            erro: "Dados inválidos",
            detalhes: erro.issues
        });
    }

    // JSON mal formado no corpo (o express.json() avisa com type "entity.parse.failed")
    if (erro instanceof Error && "type" in erro && erro.type === "entity.parse.failed") {
        return res.status(400).json({
            erro: "Os dados enviados não estão em um formato válido (JSON)."
        });
    }

    if (erro instanceof Error && "status" in erro) {
        return res.status(Number(erro.status)).json({
            erro: erro.message
        });
    }

    console.error(erro);

    return res.status(500).json({
        erro: "Erro interno no servidor"
    });
}

export default erroMiddleware;