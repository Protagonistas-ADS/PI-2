import { Router } from "express";
import AdminController from "../controllers/admin.controller";
import { autenticacaoMiddleware } from "../middlewares/autenticacao.middleware";
import { autorizarAdministrador } from "../middlewares/autenticarAdministrador.middleware";

const router = Router();

// Todas as rotas do painel exigem login de administrador
router.use(autenticacaoMiddleware, autorizarAdministrador);

// Números do dashboard (pendentes, a retirar hoje, estoque baixo, vendas do mês)
router.get("/resumo", AdminController.BuscarResumo);

export default router;
