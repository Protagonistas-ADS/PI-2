import NotaRoutes from "./routes/nota.routes";
import "dotenv/config";
import express from "express";
import cors from "cors";

import UsuarioRoutes from "./routes/usuario.routes";
import ProdutoRoutes from "./routes/produto.routes";
import PedidoRoutes from "./routes/pedido.routes";
import CotacaoRoutes from "./routes/cotacao.routes";
import EstoqueRoutes from "./routes/estoque.routes";
import VendaRoutes from "./routes/venda.routes";

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
app.use("/notas", NotaRoutes);
app.use("/vendas", VendaRoutes);

// Middleware de erro
app.use(erroMiddleware);

export default app;
