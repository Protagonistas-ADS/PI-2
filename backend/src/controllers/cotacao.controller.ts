
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
            const clienteId = req.usuario!.id;

            const resultado = await CotacaoService.ListarItens(id, clienteId);

            res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    }

};

export default CotacaoController;
