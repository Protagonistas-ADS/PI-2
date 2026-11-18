import ProdutoService from "../services/produto.service";
import { Request, Response, NextFunction } from "express";

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
}

export default ProdutoController;