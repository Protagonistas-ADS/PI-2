import { Request, Response, NextFunction } from "express";
import EstoqueService from "../services/estoque.service";

const EstoqueController = {

    async ListarSaldos(req: Request, res: Response, next: NextFunction) {
        try {
            const produtos = await EstoqueService.ListarSaldos();

            res.status(200).json({ produtos });

        } catch (error) {
            next(error);
        }
    },

    async ListarMovimentacoes(req: Request, res: Response, next: NextFunction) {
        try {
            const movimentacoes = await EstoqueService.ListarMovimentacoes();

            res.status(200).json({ movimentacoes });

        } catch (error) {
            next(error);
        }
    },

    async ListarMovimentacoesPorProduto(req: Request, res: Response, next: NextFunction) {
        try {
            const produtoId = Number(req.params.id);

            const resultado = await EstoqueService.ListarMovimentacoesPorProduto(produtoId);

            res.status(200).json(resultado);

        } catch (error) {
            next(error);
        }
    },

    async RegistrarEntrada(req: Request, res: Response, next: NextFunction) {
        try {
            const { produto_id, quantidade } = req.body;

            const resultado = await EstoqueService.RegistrarEntrada(produto_id, quantidade);

            res.status(201).json(resultado);

        } catch (error) {
            next(error);
        }
    },

    async RegistrarSaida(req: Request, res: Response, next: NextFunction) {
        try {
            const { produto_id, quantidade } = req.body;

            const resultado = await EstoqueService.RegistrarSaida(produto_id, quantidade);

            res.status(201).json(resultado);

        } catch (error) {
            next(error);
        }
    }

};

export default EstoqueController;
