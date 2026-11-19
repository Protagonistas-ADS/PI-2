
import { Request, Response, NextFunction } from "express";
import VendaService from "../services/venda.service";

const VendaController = {

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
