import db from "../configs/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface Produto extends RowDataPacket {
    id: number;
    nome: string;
    descricao: string;
    preco_unitario: number;
    quantidade_estoque: number;
    imagem: string | null;
    ativo: boolean;
}

const ProdutoRepository = {

    async Criar(nome: string, descricao: string, preco: number, quantidade: number, imagem: string): Promise<ResultSetHeader> {
        const [resultado] = await db.execute<ResultSetHeader>(`
            INSERT INTO produto (nome, descricao, preco_unitario, quantidade_estoque, imagem)
            VALUES (?, ?, ?, ?, ?);
        `, [nome, descricao, preco, quantidade, imagem]);

        return resultado;
    },

    async Listar(): Promise<Produto[]> {
        const [resultado] = await db.execute<Produto[]>(`
            SELECT
                nome,
                descricao,
                preco_unitario,
                quantidade_estoque,
                imagem,
                ativo
            FROM produto;
        `);

        return resultado;
    },

    async Buscar(id: number): Promise<Produto | null> {
        const [resultado] = await db.execute<Produto[]>(
            `SELECT
                nome,
                descricao,
                preco_unitario,
                quantidade_estoque,
                imagem,
                ativo
            FROM produto
            WHERE id = ?;`, 
            [id]);

        return resultado.length > 0 ? resultado[0] : null;
    }
};

export default ProdutoRepository;