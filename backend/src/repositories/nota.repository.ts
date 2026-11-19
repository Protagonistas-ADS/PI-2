
import db from "../configs/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import type { PoolConnection } from "mysql2/promise";

interface VendaParaNota extends RowDataPacket {
    id: number;
    valor_total: number;
}

interface ItemVenda extends RowDataPacket {
    produto_id: number;
    quantidade: number;
    preco_unitario: number;
    subtotal: number;
}

const NotaRepository = {
    async BuscarVenda(conexao: PoolConnection, vendaId: number): Promise<VendaParaNota | null> {
        const [resultado] = await conexao.execute<VendaParaNota[]>(
            `SELECT id, valor_total
             FROM venda
             WHERE id = ?
             FOR UPDATE`,
            [vendaId]
        );

        return resultado[0] ?? null;
    },

    async BuscarItensVenda(conexao: PoolConnection, vendaId: number): Promise<ItemVenda[]> {
        const [resultado] = await conexao.execute<ItemVenda[]>(
            `SELECT pi.produto_id, pi.quantidade, pi.preco_unitario, pi.subtotal
             FROM pedido_item pi
             INNER JOIN venda v ON v.pedido_id = pi.pedido_id
             WHERE v.id = ?`,
            [vendaId]
        );

        return resultado;
    },

    async VerificarNotaExistente(conexao: PoolConnection, vendaId: number): Promise<boolean> {
        const [resultado] = await conexao.execute<RowDataPacket[]>(
            `SELECT id FROM nota WHERE venda_id = ? LIMIT 1`,
            [vendaId]
        );

        return resultado.length > 0;
    },

    async Criar(
        conexao: PoolConnection,
        vendaId: number,
        numero: string,
        naturezaOperacao: string,
        valorTotal: number
    ): Promise<ResultSetHeader> {
        const [resultado] = await conexao.execute<ResultSetHeader>(
            `INSERT INTO nota (venda_id, numero, natureza_operacao, valor_total)
             VALUES (?, ?, ?, ?)`,
            [vendaId, numero, naturezaOperacao, valorTotal]
        );

        return resultado;
    },

    async CriarItem(
        conexao: PoolConnection,
        notaId: number,
        item: ItemVenda
    ): Promise<ResultSetHeader> {
        const [resultado] = await conexao.execute<ResultSetHeader>(
            `INSERT INTO nota_item
             (nota_id, produto_id, quantidade, preco_unitario, subtotal)
             VALUES (?, ?, ?, ?, ?)`,
            [
                notaId,
                item.produto_id,
                item.quantidade,
                item.preco_unitario,
                item.subtotal
            ]
        );

        return resultado;
    },

    async Listar() {
        const [resultado] = await db.execute<RowDataPacket[]>(
            `SELECT
                n.id,
                n.venda_id,
                n.numero,
                n.natureza_operacao,
                n.valor_total,
                n.data_emissao
             FROM nota n
             ORDER BY n.id DESC`
        );

        return resultado;
    }
};

export default NotaRepository;
