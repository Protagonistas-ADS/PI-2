import db from "../configs/db";
import { RowDataPacket } from "mysql2";

const PedidoRepository = {

    async ListarPorCliente(id: number) {
        const [resultado] = await db.execute(`
            SELECT
                p.id,
                p.status,
                p.previsao_busca,
                SUM(pi.quantidade) AS quantidade_total
            FROM pedido p
            INNER JOIN pedido_item pi ON pi.pedido_id = p.id
            WHERE p.cliente_id = ?
              AND p.status IN ('pendente', 'respondido')
            GROUP BY p.id, p.status, p.previsao_busca
            ORDER BY p.id DESC;
        `, [id]);

        return resultado;
    },

    async ListarItens(id: number, clienteId: number) {
        const [resultado] = await db.execute<RowDataPacket[]>(`
        SELECT
            pi.produto_id,
            p.nome AS produto_nome,
            pi.quantidade,
            pi.preco_unitario
        FROM pedido_item pi
        INNER JOIN produto p ON p.id = pi.produto_id
        INNER JOIN pedido pe ON pe.id = pi.pedido_id
        WHERE pe.id = ?
          AND pe.cliente_id = ?;
    `, [id, clienteId]);

        return resultado;
    }

};

export default PedidoRepository;