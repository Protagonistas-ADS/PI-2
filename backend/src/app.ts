import "dotenv/config";
import express from "express";
import cors from "cors";

import UsuarioRoutes from "./routes/usuario.routes";
import ProdutoRoutes from "./routes/produto.routes";
import erroMiddleware from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(cors());

// Rotas
app.use("/usuarios", UsuarioRoutes);
app.use("/produtos", ProdutoRoutes);

//Middleware de erro
app.use(erroMiddleware);

export default app;