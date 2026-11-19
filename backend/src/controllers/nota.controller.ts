
import { Request, Response, NextFunction } from "express";
import NotaService from "../services/nota.service";

const NotaController = {

    async Criar(req: Request, res: Response, next: NextFunction) {
        try {
            const { venda_id, numero, natureza_operacao } = req.body;

            const resultado = await NotaService.Criar(
                venda_id,
                numero,
                natureza_operacao
            );

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
    }

};

export default NotaController;
