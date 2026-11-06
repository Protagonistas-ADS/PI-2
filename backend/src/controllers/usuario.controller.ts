import UsuarioService from "../services/usuario.service";
import { Request, Response, NextFunction } from "express";

const UsuarioController = {
    async Cadastrar(req: Request, res: Response, next: NextFunction) {
        try {
            const { nome, email, senha } = req.body;

            await UsuarioService.Cadastrar(nome, email, senha);

            res.status(201).json({
                mensagem: "Usuário cadastrado com sucesso."
            });

        } catch (error) {
            next(error);
        }
    }
}

export default UsuarioController;