
import db from "../configs/db";
import { RowDataPacket } from "mysql2";

const CotacaoRepository = {

    async ListarPorCliente(id: number) {
        const [resultado] = await db.execute<RowDataPacket[]>(`
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

    async ListarItens(id: number, clienteId: number) {
        const [resultado] = await db.execute<RowDataPacket[]>(`
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
    }

};

export default CotacaoRepository;
