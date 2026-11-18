import db from "../configs/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface Cotacao extends RowDataPacket {
    id: number;
    status: string;
    validade: Date | null;
    lida_em: Date | null;
    quantidade_total: number;
}

interface ItemCotacao extends RowDataPacket {
    produto_id: number;
    produto_nome: string;
    quantidade: number;
    preco_unitario: number | null;
    subtotal: number | null;
}

const CotacaoRepository = {

    async ListarPorCliente(id: number): Promise<Cotacao[]> {
        const [resultado] = await db.execute<Cotacao[]>(`
            SELECT
                c.id,
                c.status,
                c.validade,
                c.lida_em,
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
                ci.produto_id,
                p.nome AS produto_nome,
                ci.quantidade,
                ci.preco_unitario,
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
    }

};

export default CotacaoRepository;