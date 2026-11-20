import { Router } from "express";
import NotaController from "../controllers/nota.controller";
import { autenticacaoMiddleware } from "../middlewares/autenticacao.middleware";
import { autorizarAdministrador } from "../middlewares/autenticarAdministrador.middleware";
import { validarSchema } from "../middlewares/validarSchema.middleware";
import { IdParamSchema } from "../schemas/comum.schema";
import { CriarNotaSchema, AtualizarLinkNotaSchema } from "../schemas/nota.schema";

const router = Router();

const validarId = validarSchema(IdParamSchema, "params");

// Notas fiscais são assunto só do administrador
router.use(autenticacaoMiddleware, autorizarAdministrador);

router.get("/", NotaController.Listar);
router.post("/", validarSchema(CriarNotaSchema), NotaController.Criar);
router.patch("/:id/cancelar", validarId, NotaController.Cancelar);
router.patch("/:id/link", validarId, validarSchema(AtualizarLinkNotaSchema), NotaController.AtualizarLink);

export default router;
