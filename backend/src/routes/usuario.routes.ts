import { Router } from "express";

import UsuarioController from "../controllers/usuario.controller";

import { validarSchema } from "../middlewares/validarSchema.middleware";
import { autenticacaoMiddleware } from "../middlewares/autenticar.middleware";
import { CadastroSchema, LoginSchema, AtualizarSchema } from "../schemas/usuario.schema";


const router = Router();


router.get("/logado", autenticacaoMiddleware, UsuarioController.BuscarUsuarioLogado);

router.post("/", validarSchema(CadastroSchema), UsuarioController.Cadastrar);
router.post("/login", validarSchema(LoginSchema), UsuarioController.Login);

router.patch("/", autenticacaoMiddleware, validarSchema(AtualizarSchema), UsuarioController.Atualizar);

export default router;