
import db from "../configs/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import type { PoolConnection } from "mysql2/promise";

interface PedidoParaVenda extends RowDataPacket {
    id: number;
    status: string;
}

interface ItemPedido extends RowDataPacket {
    produto_id: number;
    quantidade: number;
    preco_unitario: number;
}

const VendaRepository = {

    async BuscarPedido(conexao: PoolConnection, pedidoId: number): Promise<PedidoParaVenda | null> {
        const [resultado] = await conexao.execute<PedidoParaVenda[]>(`
            SELECT id, status
            FROM pedido
            WHERE id = ?
            FOR UPDATE;
        `, [pedidoId]);

        return resultado[0] ?? null;
    },

    async BuscarItensPedido(conexao: PoolConnection, pedidoId: number): Promise<ItemPedido[]> {
        const [resultado] = await conexao.execute<ItemPedido[]>(`
            SELECT produto_id, quantidade, preco_unitario
            FROM pedido_item
            WHERE pedido_id = ?;
        `, [pedidoId]);

        return resultado;
    },

    async BuscarVendaPorPedido(conexao: PoolConnection, pedidoId: number): Promise<boolean> {
        const [resultado] = await conexao.execute<RowDataPacket[]>(`
            SELECT id
            FROM venda
            WHERE pedido_id = ?
            LIMIT 1;
        `, [pedidoId]);

        return resultado.length > 0;
    },

    async Criar(conexao: PoolConnection, pedidoId: number, valorTotal: number): Promise<ResultSetHeader> {
        const [resultado] = await conexao.execute<ResultSetHeader>(`
            INSERT INTO venda (pedido_id, valor_total)
            VALUES (?, ?);
        `, [pedidoId, valorTotal]);

        return resultado;
    }

};

export default VendaRepository;
