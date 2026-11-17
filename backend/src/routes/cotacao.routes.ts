
import { Router } from "express";
import CotacaoController from "../controllers/cotacao.controller";
import { autenticacaoMiddleware } from "../middlewares/autenticacao.middleware";

const router = Router();

router.get("/cliente", autenticacaoMiddleware, CotacaoController.ListarPorCliente);
router.get("/itens/:id", autenticacaoMiddleware, CotacaoController.ListarItens);

export default router;
