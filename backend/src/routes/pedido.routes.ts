import { Router } from "express";
import PedidoController from "../controllers/pedido.controller";
import { autenticacaoMiddleware } from "../middlewares/autenticacao.middleware";

const router = Router();

router.get("/cliente", autenticacaoMiddleware, PedidoController.ListarPorCliente);
router.get("/itens/:id", autenticacaoMiddleware, PedidoController.ListarItens);

export default router;