import { Router } from "express";
import ProdutoController from "../controllers/produto.controller";
import { validarSchema } from "../middlewares/validarSchema.middleware";
import { ProdutoSchema, AlterarAtivoSchema, IdParamSchema } from "../schemas/produto.schema";
import { autenticacaoMiddleware } from "../middlewares/autenticacao.middleware";
import { autorizarAdministrador } from "../middlewares/autenticarAdministrador.middleware";

const router = Router();

const somenteAdministrador = [autenticacaoMiddleware, autorizarAdministrador];

// Públicas (catálogo aberto, sem login): só mostram produtos ativos
router.get("/", ProdutoController.Listar);

// Administrador (a rota /todos vem antes de /:id para não ser confundida com um id)
router.get("/todos", ...somenteAdministrador, ProdutoController.ListarTodos);
router.post("/", ...somenteAdministrador, validarSchema(ProdutoSchema), ProdutoController.Criar);
router.put("/:id", ...somenteAdministrador, validarSchema(IdParamSchema, "params"), validarSchema(ProdutoSchema), ProdutoController.Editar);
router.patch("/:id/ativo", ...somenteAdministrador, validarSchema(IdParamSchema, "params"), validarSchema(AlterarAtivoSchema), ProdutoController.AlterarAtivo);

// Pública: detalhes de um produto ativo
router.get("/:id", validarSchema(IdParamSchema, "params"), ProdutoController.Buscar);

export default router;
