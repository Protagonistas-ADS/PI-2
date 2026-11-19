
import { Router } from "express";
import NotaController from "../controllers/nota.controller";
import { autenticacaoMiddleware } from "../middlewares/autenticacao.middleware";

const router = Router();

router.post("/", autenticacaoMiddleware, NotaController.Criar);
router.get("/", autenticacaoMiddleware, NotaController.Listar);

export default router;
