import ProdutoService from "../services/produto.service";
import { Request, Response, NextFunction } from "express";
import { criarErro } from "../utils/criarErro";

const ProdutoController = {
    async Criar(req: Request, res: Response, next: NextFunction) {
        try {
            const { nome, descricao, preco, quantidade } = req.body;

            await ProdutoService.Criar(nome, descricao, preco, quantidade);

            res.sendStatus(201);

        } catch (error) {
            next(error);
        }
    },

    async Listar(req: Request, res: Response, next: NextFunction) {
        try {
            const produtos = await ProdutoService.Listar();

            res.status(200).json({ produtos });

        } catch (error) {
            next(error);
        }
    }

    async Buscar(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const produto = await ProdutoService.Buscar(parseInt(id));

            if (!produto) {
                throw criarErro("Produto não encontrado.", 404);
            }

            res.status(200).json({ produto });

        } catch (error) {
            next(error);
        }
    }
};

export default ProdutoController;