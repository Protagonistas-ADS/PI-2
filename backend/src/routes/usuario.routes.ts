import { Router } from "express";

import UsuarioController from "../controllers/usuario.controller";

import { validarSchema } from "../middlewares/validarSchema.middleware";
import { autenticacaoMiddleware } from "../middlewares/autenticacao.middleware";
import { limiteLogin } from "../middlewares/limiteLogin.middleware";
import { CadastroSchema, LoginSchema, AtualizarSchema } from "../schemas/usuario.schema";


const router = Router();


router.get("/logado", autenticacaoMiddleware, UsuarioController.BuscarUsuarioLogado);

router.post("/", validarSchema(CadastroSchema), UsuarioController.Cadastrar);
// limiteLogin vem antes de tudo: bloqueia quem errou a senha muitas vezes seguidas
router.post("/login", limiteLogin, validarSchema(LoginSchema), UsuarioController.Login);

router.patch("/", autenticacaoMiddleware, validarSchema(AtualizarSchema), UsuarioController.Atualizar);

export default router;