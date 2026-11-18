import { Request, Response, NextFunction } from "express";
import PedidoService from "../services/pedido.service";

const PedidoController = {

    async ListarPorCliente(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.usuario!.id;

            const pedidos = await PedidoService.ListarPorCliente(id);

            res.status(200).json({ pedidos });

        } catch (error) {
            next(error);
        }
    },

    async ListarItens(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const clienteId = req.usuario!.id;

            const produtos = await PedidoService.ListarItens(id, clienteId);

            res.status(200).json({ produtos });

        } catch (error) {
            next(error);
        }
    },

    async Cancelar(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const clienteId = req.usuario!.id;

            await PedidoService.Cancelar(id, clienteId);

            res.sendStatus(204);

        } catch (error) {
            next(error);
        }
    }
};

export default PedidoController;