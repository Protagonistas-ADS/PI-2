
import { Router } from "express";

import CotacaoController from "../controllers/cotacao.controller";

import { autenticacaoMiddleware } from "../middlewares/autenticar.middleware";
import { autorizarAdministrador } from "../middlewares/autorizar.middleware";
import { validarSchema } from "../middlewares/validarSchema.middleware";

import {
    CriarCotacaoSchema,
    EditarCotacaoSchema
} from "../schemas/cotacao.schema";

const router = Router();

// Todas as rotas exigem autenticação
router.use(autenticacaoMiddleware);

// Criar cotação: cliente e administrador
router.post(
    "/",
    validarSchema(CriarCotacaoSchema),
    CotacaoController.Criar
);

// Listar cotações
router.get(
    "/",
    CotacaoController.Listar
);

// Buscar cotação por ID
router.get(
    "/:id",
    CotacaoController.BuscarPorId
);

// Editar cotação: somente administrador
router.put(
    "/:id",
    autorizarAdministrador,
    validarSchema(EditarCotacaoSchema),
    CotacaoController.Atualizar
);

// Excluir cotação: somente administrador
router.delete(
    "/:id",
    autorizarAdministrador,
    CotacaoController.Deletar
);

export default router;
