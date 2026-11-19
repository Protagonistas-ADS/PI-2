
import { Request, Response, NextFunction } from "express";
import CotacaoService from "../services/cotacao.service";

const CotacaoController = {

    async ListarPorCliente(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.usuario!.id;

            const cotacoes = await CotacaoService.ListarPorCliente(id);

            res.status(200).json({ cotacoes });

        } catch (error) {
            next(error);
        }
    },

    async ListarItens(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const cliente_id = req.usuario!.id;

            const resultado = await CotacaoService.ListarItens(id, cliente_id);

            res.status(200).json(resultado);

        } catch (error) {
            next(error);
        }
    },

    async Cancelar(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const cliente_id = req.usuario!.id;

            await CotacaoService.Cancelar(id, cliente_id);

            res.sendStatus(204)

        } catch (error) {
            next(error);
        }
    },

    async MarcarComoLida(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const cliente_id = req.usuario!.id;

            await CotacaoService.MarcarComoLida(id, cliente_id);

            res.sendStatus(204);

        } catch (error) {
            next(error);
        }
    },

    async ConverterCotacao(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params);
            const cliente_id = req.usuario!.id;

            await CotacaoService.ConverterCotacao(Number(id), cliente_id);

            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    },

    async RecusarCotacao(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params);
            const cliente_id = req.usuario!.id;

            await CotacaoService.RecusarCotacao(id, cliente_id);

            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }

};

export default CotacaoController;
