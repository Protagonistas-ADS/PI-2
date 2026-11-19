
import { Router } from "express";
import VendaController from "../controllers/venda.controller";
import { autenticacaoMiddleware } from "../middlewares/autenticacao.middleware";
import { autorizarAdministrador } from "../middlewares/autenticarAdministrador.middleware";

const router = Router();

router.post(
    "/",
    autenticacaoMiddleware,
    autorizarAdministrador,
    VendaController.Criar
);

export default router;
