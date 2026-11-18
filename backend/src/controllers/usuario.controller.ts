import UsuarioService from "../services/usuario.service";
import { Request, Response, NextFunction } from "express";

const UsuarioController = {
    async Cadastrar(req: Request, res: Response, next: NextFunction) {
        try {
            const { nome, email, senha } = req.body;

            await UsuarioService.Cadastrar(nome, email, senha);

            res.sendStatus(201);

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
            return res.status(200).json({ usuario: req.usuario });

        } catch (error) {
            next(error);
        }
    },

    async Atualizar(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.usuario!.id;
            const dados = req.body;

            await UsuarioService.Atualizar(id, dados);

            return res.sendStatus(204);
            
        } catch (error) {
            next(error);
        }
    }
}

export default UsuarioController;