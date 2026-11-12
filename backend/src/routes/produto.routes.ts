import { Router } from "express";
import ProdutoController from "../controllers/produto.controller";
import { validarSchema } from "../middlewares/validarSchema.middleware";
import { ProdutoSchema } from "../schemas/produto.schema";
import { autenticacaoMiddleware } from "../middlewares/autenticar.middleware";

const router = Router();

router.get("/", autenticacaoMiddleware, ProdutoController.Listar);
router.post("/", autenticacaoMiddleware, validarSchema(ProdutoSchema), ProdutoController.Criar);

export default router;