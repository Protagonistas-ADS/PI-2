import { Router } from "express";
import PedidoController from "../controllers/pedido.controller";
import { autenticacaoMiddleware } from "../middlewares/autenticacao.middleware";
import { autorizarAdministrador } from "../middlewares/autenticarAdministrador.middleware";
import { autorizarCliente } from "../middlewares/autorizarCliente.middleware";
import { validarSchema } from "../middlewares/validarSchema.middleware";
import { IdParamSchema } from "../schemas/comum.schema";
import { CriarPedidoSchema, AlterarStatusPedidoSchema } from "../schemas/pedido.schema";

const router = Router();

const somenteCliente = [autenticacaoMiddleware, autorizarCliente];
const somenteAdministrador = [autenticacaoMiddleware, autorizarAdministrador];
const validarId = validarSchema(IdParamSchema, "params");

// Cliente: fazer pedido e acompanhar os próprios pedidos
router.post("/", ...somenteCliente, validarSchema(CriarPedidoSchema), PedidoController.Criar);
router.get("/cliente", ...somenteCliente, PedidoController.ListarPorCliente);
router.get("/itens/:id", ...somenteCliente, validarId, PedidoController.ListarItens);
router.patch("/cancelar/:id", ...somenteCliente, validarId, PedidoController.Cancelar);

// Administrador: ver todos os pedidos e mudar o status
router.get("/", ...somenteAdministrador, PedidoController.ListarTodos);
router.get("/:id/itens", ...somenteAdministrador, validarId, PedidoController.ListarItensAdmin);
router.patch("/:id/status", ...somenteAdministrador, validarId, validarSchema(AlterarStatusPedidoSchema), PedidoController.AlterarStatus);

export default router;
