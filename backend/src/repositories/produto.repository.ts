import db from "../configs/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface Produto extends RowDataPacket {
    id: number;
    nome: string;
    descricao: string;
    preco_unitario: number;
    quantidade_estoque: number;
    ativo: boolean;
}

const ProdutoRepository = {

    async Criar(nome: string, descricao: string, preco: number, quantidade: number): Promise<ResultSetHeader> {
        const [resultado] = await db.execute<ResultSetHeader>(`
            INSERT INTO produto (nome, descricao, preco_unitario, quantidade_estoque)
            VALUES (?, ?, ?, ?);
        `, [nome, descricao, preco, quantidade]);

        return resultado;
    },

    async Listar(): Promise<Produto[]> {
        const [resultado] = await db.execute<Produto[]>(`
            SELECT * FROM produto;
        `);

        return resultado;
    },

};

export default ProdutoRepository;