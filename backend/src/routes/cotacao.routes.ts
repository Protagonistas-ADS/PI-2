import { Router } from "express";
import CotacaoController from "../controllers/cotacao.controller";
import { autenticacaoMiddleware } from "../middlewares/autenticacao.middleware";

const router = Router();

router.get("/cliente", autenticacaoMiddleware, CotacaoController.ListarPorCliente);
router.get("/itens/:id", autenticacaoMiddleware, CotacaoController.ListarItens);
router.patch("/cancelar/:id", autenticacaoMiddleware, CotacaoController.Cancelar);
router.patch("/lida/:id", autenticacaoMiddleware, CotacaoController.marcarComoLida);

export default router;
