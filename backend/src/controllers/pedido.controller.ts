import { Request, Response, NextFunction } from "express";
import PedidoService from "../services/pedido.service";

// Os dados já chegam conferidos pelo Zod (schemas/pedido.schema.ts e o :id).
const PedidoController = {

    async ListarPorCliente(req: Request, res: Response, next: NextFunction) {
        try {
            const pedidos = await PedidoService.ListarPorCliente(req.usuario.id);

            res.status(200).json({ pedidos });

        } catch (error) {
            next(error);
        }
    },

    async ListarTodos(req: Request, res: Response, next: NextFunction) {
        try {
            const pedidos = await PedidoService.ListarTodos();

            res.status(200).json({ pedidos });

        } catch (error) {
            next(error);
        }
    },

    async ListarItens(req: Request, res: Response, next: NextFunction) {
        try {
            const produtos = await PedidoService.ListarItens(Number(req.params.id), req.usuario.id);

            res.status(200).json({ produtos });

        } catch (error) {
            next(error);
        }
    },

    // Administrador: itens de qualquer pedido
    async ListarItensAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const produtos = await PedidoService.ListarItensAdmin(Number(req.params.id));

            res.status(200).json({ produtos });

        } catch (error) {
            next(error);
        }
    },

    async Cancelar(req: Request, res: Response, next: NextFunction) {
        try {
            await PedidoService.Cancelar(Number(req.params.id), req.usuario.id);

            res.sendStatus(204);

        } catch (error) {
            next(error);
        }
    },

    async Criar(req: Request, res: Response, next: NextFunction) {
        try {
            const pedidoId = await PedidoService.Criar(req.usuario.id, req.body);

            res.status(201).json({
                mensagem: "Pedido criado com sucesso.",
                pedidoId
            });

        } catch (error) {
            next(error);
        }
    },

    async AlterarStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const resultado = await PedidoService.AlterarStatus(Number(req.params.id), req.body.status);

            res.status(200).json(resultado);

        } catch (error) {
            next(error);
        }
    }
};

export default PedidoController;
