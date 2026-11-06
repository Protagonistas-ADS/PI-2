import { Router } from "express";
import UsuarioController from "../controllers/usuario.controller";
import { validarSchema } from "../middlewares/validarSchema.middleware";
import { CadastroSchema } from "../schemas/usuario.schema";

const router = Router();

router.post("/", validarSchema(CadastroSchema), UsuarioController.Cadastrar);

export default router;