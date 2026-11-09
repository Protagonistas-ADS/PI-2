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
    },

    async Login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, senha } = req.body;

            const resultado = await UsuarioService.Login(email, senha);

            return res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    },

    async BuscarUsuarioLogado(req: Request, res: Response, next: NextFunction) {
        try {

            return res.status(201).json({
                usuario: req.usuario
            });

        } catch (error) {
            next(error);
        }
    }
}

export default UsuarioController;