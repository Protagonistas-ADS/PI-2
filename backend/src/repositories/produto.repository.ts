import db from "../configs/db";

const ProdutoRepository = {

    async Criar(nome:string, descricao: string, preco: number, quantidade: number) {
        await db.execute(`
            INSERT INTO produto (nome, descricao, preco_unitario, quantidade_estoque)
            VALUES (?, ?, ?, ?)
        `, [nome, descricao, preco, quantidade]);
    },

    async Listar() {
        await db.execute(`
            SELECT * FROM produto
        `);
    },
}

export default ProdutoRepository;