import { Router } from "express";
import VendaController from "../controllers/venda.controller";
import { autenticacaoMiddleware } from "../middlewares/autenticacao.middleware";
import { autorizarAdministrador } from "../middlewares/autenticarAdministrador.middleware";
import { validarSchema } from "../middlewares/validarSchema.middleware";
import { CriarVendaSchema } from "../schemas/venda.schema";

const router = Router();

// Vendas são assunto só do administrador
router.use(autenticacaoMiddleware, autorizarAdministrador);

// Tabela de vendas (com cliente e nota emitida, se houver)
router.get("/", VendaController.ListarTodas);

// Registrar a venda de um pedido entregue que ficou sem venda (ex.: pedidos antigos)
router.post("/", validarSchema(CriarVendaSchema), VendaController.Criar);

export default router;
