import { Request, Response, NextFunction } from "express";
import NotaService from "../services/nota.service";

const NotaController = {

    async Criar(req: Request, res: Response, next: NextFunction) {
        try {
            const resultado = await NotaService.Criar(req.body);

            res.status(201).json(resultado);

        } catch (error) {
            next(error);
        }
    },

    async Listar(req: Request, res: Response, next: NextFunction) {
        try {
            const notas = await NotaService.Listar();

            res.status(200).json({ notas });

        } catch (error) {
            next(error);
        }
    },

    async Cancelar(req: Request, res: Response, next: NextFunction) {
        try {
            const resultado = await NotaService.Cancelar(Number(req.params.id));

            res.status(200).json(resultado);

        } catch (error) {
            next(error);
        }
    }
};

export default NotaController;
