import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { criarErro } from "../utils/criarErro";
import UsuarioRepository from "../repositories/usuario.repository";

export async function autenticacaoMiddleware(
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

        // Token vencido (passou de 8h) ou alterado: pede login de novo (401), em vez de erro 500
        let dadosUsuario: string | jwt.JwtPayload;

        try {
            dadosUsuario = jwt.verify(token, chaveSecreta);
        } catch (erroToken) {
            if (erroToken instanceof jwt.TokenExpiredError) {
                throw criarErro("Sua sessão expirou. Faça login novamente.", 401);
            }

            throw criarErro("Token inválido", 401);
        }

        if (typeof dadosUsuario === "string") {
            throw criarErro("Token inválido", 401);
        }

        const idUsuario = dadosUsuario.id as number;

        const usuario = await UsuarioRepository.BuscarPorId(idUsuario);

        if (!usuario) {
            throw criarErro("Usuário não encontrado", 401);
        }

        req.usuario = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            perfil: usuario.perfil,
            criado_em: usuario.criado_em
        };

        next();
    } catch (error) {
        next(error);
    }
}