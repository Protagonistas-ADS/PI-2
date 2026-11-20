import ProdutoService from "../services/produto.service";
import { Request, Response, NextFunction } from "express";

const ProdutoController = {
    async Criar(req: Request, res: Response, next: NextFunction) {
        try {
            const { nome, descricao, preco, quantidade, imagem } = req.body;

            const id = await ProdutoService.Criar(nome, descricao, preco, quantidade, imagem ?? null);

            res.status(201).json({ id });

        } catch (error) {
            next(error);
        }
    },

    async Listar(req: Request, res: Response, next: NextFunction) {
        try {
            const produtos = await ProdutoService.ListarAtivos();

            res.status(200).json({ produtos });

        } catch (error) {
            next(error);
        }
    },

    async ListarTodos(req: Request, res: Response, next: NextFunction) {
        try {
            const produtos = await ProdutoService.ListarTodos();

            res.status(200).json({ produtos });

        } catch (error) {
            next(error);
        }
    },

    async Buscar(req: Request, res: Response, next: NextFunction) {
        try {
            // O :id já foi conferido pelo Zod (IdParamSchema).
            const produto = await ProdutoService.Buscar(Number(req.params.id));

            res.status(200).json({ produto });

        } catch (error) {
            next(error);
        }
    },

    async Editar(req: Request, res: Response, next: NextFunction) {
        try {
            const { nome, descricao, preco, quantidade, imagem } = req.body;

            await ProdutoService.Editar(Number(req.params.id), nome, descricao, preco, quantidade, imagem ?? null);

            res.sendStatus(204);

        } catch (error) {
            next(error);
        }
    },

    async AlterarAtivo(req: Request, res: Response, next: NextFunction) {
        try {
            await ProdutoService.AlterarAtivo(Number(req.params.id), req.body.ativo);

            res.sendStatus(204);

        } catch (error) {
            next(error);
        }
    }
};

export default ProdutoController;
