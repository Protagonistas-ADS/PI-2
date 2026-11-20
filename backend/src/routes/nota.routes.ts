
import { Router } from "express";
import NotaController from "../controllers/nota.controller";
import { autenticacaoMiddleware } from "../middlewares/autenticacao.middleware";
import { autorizarAdministrador } from "../middlewares/autenticarAdministrador.middleware";

const router = Router();

// Notas fiscais são assunto só do administrador
router.use(autenticacaoMiddleware, autorizarAdministrador);

router.post("/", NotaController.Criar);
router.get("/", NotaController.Listar);

export default router;
