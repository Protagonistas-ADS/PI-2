import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import "./configs/zod";
import { opcoesCors } from "./configs/cors";

import UsuarioRoutes from "./routes/usuario.routes";
import ProdutoRoutes from "./routes/produto.routes";
import PedidoRoutes from "./routes/pedido.routes";
import EstoqueRoutes from "./routes/estoque.routes";
import VendaRoutes from "./routes/venda.routes";
import NotaRoutes from "./routes/nota.routes";
import AdminRoutes from "./routes/admin.routes";

import erroMiddleware from "./middlewares/error.middleware";

const app = express();

// Cabeçalhos de segurança em todas as respostas (e esconde o "X-Powered-By: Express")
app.use(helmet());
// Só o endereço do site (CORS_ORIGIN no .env) pode chamar a API pelo navegador
app.use(cors(opcoesCors));
app.use(express.json());
// As fotos são abertas pelo site, que roda em outro endereço (outra porta):
// libera só elas para serem exibidas lá
app.use("/uploads", (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
}, express.static("uploads"));

// Rotas
app.use("/usuarios", UsuarioRoutes);
app.use("/produtos", ProdutoRoutes);
app.use("/pedidos", PedidoRoutes);
app.use("/estoque", EstoqueRoutes);
app.use("/notas", NotaRoutes);
app.use("/vendas", VendaRoutes);
app.use("/admin", AdminRoutes);

// Endereço que não existe: responde no mesmo formato de erro da API
app.use((req, res) => {
    res.status(404).json({ erro: "Rota não encontrada." });
});

// Middleware de erro
app.use(erroMiddleware);

export default app;
