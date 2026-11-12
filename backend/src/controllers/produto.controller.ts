import ProdutoService from "../services/produto.service";
import { Request, Response, NextFunction } from "express";

const ProdutoController = {
    async Criar(req: Request, res: Response, next: NextFunction) {
        try {
            const { nome, descricao, preco, quantidade } = req.body;

            await ProdutoService.Criar(nome, descricao, preco, quantidade);

            res.status(201).json({
                mensagem: "Produto cadastrado com sucesso."
            });

        } catch (error) {
            next(error);
        }
    },
    
    async Listar(req: Request, res: Response, next: NextFunction) {
        try {
            await ProdutoService.Listar();

            res.status(200).json({
                mensagem: "Produtos listados com sucesso."
            });
        } catch (error) {
            next(error);
        }
    }
}

export default ProdutoController;