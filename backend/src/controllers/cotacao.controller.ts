
import { Request, Response, NextFunction } from "express";
import CotacaoService from "../services/cotacao.service";

const CotacaoController = {

    async Criar(req: Request, res: Response, next: NextFunction) {
        try {
            const resultado = await CotacaoService.Criar(
                req.usuario,
                req.body
            );

            return res.status(201).json({
                mensagem: "Cotação criada com sucesso.",
                cotacao: resultado
            });

        } catch (error) {
            next(error);
        }
    },

    async Listar(req: Request, res: Response, next: NextFunction) {
        try {
            const cotacoes = await CotacaoService.Listar(req.usuario);

            return res.status(200).json({
                cotacoes
            });

        } catch (error) {
            next(error);
        }
    },

    async BuscarPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            const cotacao = await CotacaoService.BuscarPorId(
                id,
                req.usuario
            );

            return res.status(200).json({
                cotacao
            });

        } catch (error) {
            next(error);
        }
    },

    async Atualizar(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            const resultado = await CotacaoService.Atualizar(
                id,
                req.body
            );

            return res.status(200).json(resultado);

        } catch (error) {
            next(error);
        }
    },

    async Deletar(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            const resultado = await CotacaoService.Deletar(id);

            return res.status(200).json(resultado);

        } catch (error) {
            next(error);
        }
    }
};

export default CotacaoController;
