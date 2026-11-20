import { Router } from "express";
import VendaController from "../controllers/venda.controller";
import { autenticacaoMiddleware } from "../middlewares/autenticacao.middleware";
import { autorizarAdministrador } from "../middlewares/autenticarAdministrador.middleware";
import { validarSchema } from "../middlewares/validarSchema.middleware";
import { CriarVendaSchema } from "../schemas/venda.schema";

const router = Router();

router.post(
    "/",
    autenticacaoMiddleware,
    autorizarAdministrador,
    validarSchema(CriarVendaSchema),
    VendaController.Criar
);

export default router;
