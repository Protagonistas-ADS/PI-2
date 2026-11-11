
import { Request, Response, NextFunction } from "express";
import { criarErro } from "../utils/criarErro";

export function autorizarAdministrador(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        if (!req.usuario) {
            throw criarErro("Usuário não autenticado.", 401);
        }

        if (req.usuario.perfil !== "administrador") {
            throw criarErro("Acesso permitido somente para administradores.", 403);
        }

        next();
    } catch (error) {
        next(error);
    }
}
