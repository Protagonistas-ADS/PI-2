import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { criarErro } from "../utils/criarErro";

export function autenticacaoMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const autorizacao = req.headers.authorization;

        if (!autorizacao || !autorizacao.startsWith("Bearer ")) {
            throw criarErro("Token não informado", 401);
        }

        const token = autorizacao.split(" ")[1];

        if (!token) {
            throw criarErro("Falta de Token", 401);
        }

        const chaveSecreta = process.env.JWT_SECRET;

        if (!chaveSecreta) {
            throw new Error("JWT_SECRET não configurada.");
        }

        const dadosUsuario = jwt.verify(token, chaveSecreta);

        if (typeof dadosUsuario === "string") {
            throw criarErro("Token inválido", 401);
        }

        req.usuario = {
            id: dadosUsuario.id as number,
            perfil: dadosUsuario.perfil as "cliente" | "administrador"
        };

        next();
    } catch (error) {
        next(error);
    }
}