import app from "./app.js";
import db from "./configs/db.js";

const port = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        const conexao = await db.getConnection();

        console.log("Conexão com o banco estabelecida.");

        conexao.release();

        app.listen(port, () => {
            console.log(`Servidor rodando em http://localhost:${port}`);
        });

    } catch (erro) {
        console.error("Erro ao conectar ao banco:", erro);
        process.exit(1);
    }
}

iniciarServidor();