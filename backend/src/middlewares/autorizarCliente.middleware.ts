import { Request, Response, NextFunction } from "express";
import { criarErro } from "../utils/criarErro";

// Libera a rota só para quem tem perfil de cliente (ex.: fazer pedido).
export function autorizarCliente(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.usuario) {
        return next(criarErro("Usuário não autenticado.", 401));
    }

    if (req.usuario.perfil !== "cliente") {
        return next(criarErro("Acesso permitido somente para clientes.", 403));
    }

    next();
}
