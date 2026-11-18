import db from "../configs/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface Pedido extends RowDataPacket {
    id: number;
    status: 'pendente' | 'respondido';
    previsao_busca: Date | null;
    quantidade_total: number;
}

export interface ItemPedido extends RowDataPacket {
    produto_id: number;
    produto_nome: string;
    quantidade: number;
    preco_unitario: number;
}

const PedidoRepository = {

    async ListarPorCliente(id: number): Promise<Pedido[]> {
        const [resultado] = await db.execute<Pedido[]>(`
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

    async ListarItens(id: number, clienteId: number): Promise<ItemPedido[]> {
        const [resultado] = await db.execute<ItemPedido[]>(`
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
    },

    async Cancelar(id: number, clienteId: number): Promise<ResultSetHeader> {
        const [resultado] = await db.execute<ResultSetHeader>(`
            UPDATE pedido
            SET status = 'cancelado'
            WHERE id = ?
              AND cliente_id = ?
              AND status IN ('pendente', 'respondido');
        `, [id, clienteId]);

        return resultado;
    }

};

export default PedidoRepository;