
import "dotenv/config";
import express from "express";
import cors from "cors";

import UsuarioRoutes from "./routes/usuario.routes";
import ProdutoRoutes from "./routes/produto.routes";
import PedidoRoutes from "./routes/pedido.routes";
import CotacaoRoutes from "./routes/cotacao.routes";
import EstoqueRoutes from "./routes/estoque.routes";

import erroMiddleware from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Rotas
app.use("/usuarios", UsuarioRoutes);
app.use("/produtos", ProdutoRoutes);
app.use("/pedidos", PedidoRoutes);
app.use("/cotacoes", CotacaoRoutes);
app.use("/estoque", EstoqueRoutes);

// Middleware de erro
app.use(erroMiddleware);

export default app;
