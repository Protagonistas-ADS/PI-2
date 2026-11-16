import { Request, Response, NextFunction } from "express";
import PedidoService from "../services/pedido.service";

const PedidoController = {

    async ListarDoCliente(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.usuario.id;

            const pedidos = await PedidoService.ListarDoCliente(id);

            res.status(200).json({ pedidos });
        } catch (error) {
            next(error);
        }
    }

};

export default PedidoController;