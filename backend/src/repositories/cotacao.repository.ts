import db from "../configs/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface Cotacao extends RowDataPacket {
    id: number;
    status: string;
    validade: Date | null;
    lidaEm: Date | null;
    quantidadeTotal: number;
}

export interface ItemCotacao extends RowDataPacket {
    produtoId: number;
    produtoNome: string;
    quantidade: number;
    precoUnitario: number | null;
    subtotal: number | null;
}

const CotacaoRepository = {

    async ListarPorCliente(id: number): Promise<Cotacao[]> {
        const [resultado] = await db.execute<Cotacao[]>(`
            SELECT
                c.id,
                c.status,
                c.validade,
                c.lida_em AS lidaEm,
                SUM(ci.quantidade) AS quantidade_total
            FROM cotacao c
            INNER JOIN cotacao_item ci ON ci.cotacao_id = c.id
            WHERE c.cliente_id = ?
              AND (
                  c.status IN ('pendente', 'respondida')
                  OR (c.status = 'expirada' AND c.lida_em IS NULL)
              )
            GROUP BY c.id, c.status, c.validade, c.lida_em
            ORDER BY c.id DESC;
        `, [id]);

        return resultado;
    },

    async ListarItens(id: number, clienteId: number): Promise<ItemCotacao[]> {
        const [resultado] = await db.execute<ItemCotacao[]>(`
            SELECT
                ci.produto_id AS produtoId,
                p.nome AS produtoNome,
                ci.quantidade,
                ci.preco_unitario AS precoUnitario,
                ci.subtotal
            FROM cotacao_item ci
            INNER JOIN produto p ON p.id = ci.produto_id
            INNER JOIN cotacao c ON c.id = ci.cotacao_id
            WHERE c.id = ?
              AND c.cliente_id = ?;
        `, [id, clienteId]);

        return resultado;
    },

    async Cancelar(id: number, clienteId: number): Promise<ResultSetHeader> {
        const [resultado] = await db.execute<ResultSetHeader>(`
            UPDATE cotacao
            SET status = 'cancelada'
            WHERE id = ?
              AND cliente_id = ?
              AND status IN ('pendente', 'respondida');
        `, [id, clienteId]);

        return resultado;
    },

    async MarcarComoLida(id: number, clienteId: number): Promise<ResultSetHeader> {
        const [resultado] = await db.execute<ResultSetHeader>(`
            UPDATE cotacao
            SET lida_em = NOW()
            WHERE id = ?
              AND cliente_id = ?
              AND status = 'expirada'
              AND lida_em IS NULL;
        `, [id, clienteId]);

        return resultado;
    },

    async ConverterCotacao(id: number, clienteId: number): Promise<ResultSetHeader> {
        const [resultado] = await db.execute<ResultSetHeader>(`
            UPDATE cotacao
            SET status = "convertida"
            WHERE id = ?
                AND cliente_id = ?
                AND status = "respondida"    
        `, [id, clienteId]);

        return resultado;
    },

    async RecusarCotacao(id: number, clienteId: number): Promise<ResultSetHeader> {
        const [resultado] = await db.execute<ResultSetHeader>(`
            UPDATE cotacao
            SET status = "recusada"
            WHERE id = ?
                AND cliente_id = ?
                AND status = "respondida"
        `, [id, clienteId]);

        return resultado;
    },

};

export default CotacaoRepository;