import { Router } from "express";
import EstoqueController from "../controllers/estoque.controller";
import { autenticacaoMiddleware } from "../middlewares/autenticacao.middleware";
import { autorizarAdministrador } from "../middlewares/autenticarAdministrador.middleware";
import { validarSchema } from "../middlewares/validarSchema.middleware";
import { MovimentacaoEstoqueSchema } from "../schemas/estoque.schema";
import { IdParamSchema } from "../schemas/comum.schema";

const router = Router();

// Todas as rotas de estoque exigem login de administrador
router.use(autenticacaoMiddleware, autorizarAdministrador);

router.get("/", EstoqueController.ListarSaldos);
router.get("/movimentacoes", EstoqueController.ListarMovimentacoes);
router.get("/movimentacoes/:id", validarSchema(IdParamSchema, "params"), EstoqueController.ListarMovimentacoesPorProduto);

router.post("/entrada", validarSchema(MovimentacaoEstoqueSchema), EstoqueController.RegistrarEntrada);
router.post("/saida", validarSchema(MovimentacaoEstoqueSchema), EstoqueController.RegistrarSaida);

export default router;
