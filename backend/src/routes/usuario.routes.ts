import { Router } from "express";
import UsuarioController from "../controllers/usuario.controller";
import { validarSchema } from "../middlewares/validarSchema.middleware";
import { CadastroSchema, LoginSchema } from "../schemas/usuario.schema";

const router = Router();


router.post("/", validarSchema(CadastroSchema), UsuarioController.Cadastrar);
router.post("/login", validarSchema(LoginSchema), UsuarioController.Login);

export default router;