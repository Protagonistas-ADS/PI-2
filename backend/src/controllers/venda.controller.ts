
import { Request, Response, NextFunction } from "express";
import VendaService from "../services/venda.service";

const VendaController = {

    async ListarTodas(req: Request, res: Response, next: NextFunction) {
        try {
            const vendas = await VendaService.ListarTodas();

            res.status(200).json({ vendas });

        } catch (error) {
            next(error);
        }
    },

    async Criar(req: Request, res: Response, next: NextFunction) {
        try {
            const { pedido_id } = req.body;

            const resultado = await VendaService.Criar(pedido_id);

            res.status(201).json(resultado);

        } catch (error) {
            next(error);
        }
    }

};

export default VendaController;
