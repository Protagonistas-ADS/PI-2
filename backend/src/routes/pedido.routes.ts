import { Router } from "express";
import PedidoController from "../controllers/pedido.controller";
import { autenticacaoMiddleware } from "../middlewares/autenticacao.middleware"

const router = Router();

router.get("/", autenticacaoMiddleware, PedidoController.ListarDoCliente);

export default router;