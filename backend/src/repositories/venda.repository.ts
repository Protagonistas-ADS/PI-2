
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

// Venda na tabela do painel: com o cliente e a nota 'emitida' (se houver)
export interface VendaListada extends RowDataPacket {
    id: number;
    pedido_id: number;
    valor_total: string | number;
    data_venda: Date;
    cliente_id: number;
    cliente_nome: string;
    cliente_email: string;
    quantidade_total: string | number;
    nota_id: number | null;
    nota_numero: string | null;
}

const VendaRepository = {

    // Todas as vendas, da mais nova para a mais antiga.
    // A nota entra só se estiver 'emitida' (nota cancelada = venda sem nota).
    async ListarTodas(): Promise<VendaListada[]> {
        const [resultado] = await db.execute<VendaListada[]>(`
            SELECT
                v.id,
                v.pedido_id,
                v.valor_total,
                v.data_venda,
                u.id AS cliente_id,
                u.nome AS cliente_nome,
                u.email AS cliente_email,
                (SELECT COALESCE(SUM(pi.quantidade), 0) FROM pedido_item pi WHERE pi.pedido_id = v.pedido_id) AS quantidade_total,
                n.id AS nota_id,
                n.numero AS nota_numero
            FROM venda v
            INNER JOIN pedido p ON p.id = v.pedido_id
            INNER JOIN usuario u ON u.id = p.cliente_id
            LEFT JOIN nota n ON n.venda_id = v.id AND n.status = 'emitida'
            ORDER BY v.data_venda DESC, v.id DESC;
        `);

        return resultado;
    },

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
