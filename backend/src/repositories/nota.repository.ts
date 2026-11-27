import db from "../configs/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import type { PoolConnection } from "mysql2/promise";
import type { StatusNota } from "../schemas/nota.schema";

interface VendaParaNota extends RowDataPacket {
    id: number;
}

interface ItemVenda extends RowDataPacket {
    produto_id: number;
    quantidade: number;
    preco_unitario: number;
}

interface NotaBloqueada extends RowDataPacket {
    id: number;
    numero: string;
    status: StatusNota;
}

// Nota na tabela do painel (mesmos nomes que a API devolve)
export interface NotaListada extends RowDataPacket {
    id: number;
    venda_id: number;
    pedido_id: number;
    cliente_nome: string;
    numero: string;
    natureza_operacao: string;
    valor_total: string | number;
    status: StatusNota;
    link_pdf: string | null;
    data_emissao: Date;
}

const NotaRepository = {
    async BuscarVenda(conexao: PoolConnection, vendaId: number): Promise<VendaParaNota | null> {
        const [resultado] = await conexao.execute<VendaParaNota[]>(
            `SELECT id
             FROM venda
             WHERE id = ?
             FOR UPDATE`,
            [vendaId]
        );

        return resultado[0] ?? null;
    },

    async BuscarItensVenda(conexao: PoolConnection, vendaId: number): Promise<ItemVenda[]> {
        const [resultado] = await conexao.execute<ItemVenda[]>(
            `SELECT pi.produto_id, pi.quantidade, pi.preco_unitario
             FROM pedido_item pi
             INNER JOIN venda v ON v.pedido_id = pi.pedido_id
             WHERE v.id = ?`,
            [vendaId]
        );

        return resultado;
    },

    // Só conta nota 'emitida': se a anterior foi cancelada, pode registrar outra
    async VerificarNotaEmitida(conexao: PoolConnection, vendaId: number): Promise<boolean> {
        const [resultado] = await conexao.execute<RowDataPacket[]>(
            `SELECT id FROM nota WHERE venda_id = ? AND status = 'emitida' LIMIT 1`,
            [vendaId]
        );

        return resultado.length > 0;
    },

    async VerificarNumeroExistente(conexao: PoolConnection, numero: string): Promise<boolean> {
        const [resultado] = await conexao.execute<RowDataPacket[]>(
            `SELECT id FROM nota WHERE numero = ? LIMIT 1`,
            [numero]
        );

        return resultado.length > 0;
    },

    async Criar(
        conexao: PoolConnection,
        vendaId: number,
        numero: string,
        naturezaOperacao: string,
        linkPdf: string | null
    ): Promise<ResultSetHeader> {
        const [resultado] = await conexao.execute<ResultSetHeader>(
            `INSERT INTO nota (venda_id, numero, natureza_operacao, status, link_pdf)
             VALUES (?, ?, ?, 'emitida', ?)`,
            [vendaId, numero, naturezaOperacao, linkPdf]
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
             (nota_id, produto_id, quantidade, preco_unitario)
             VALUES (?, ?, ?, ?)`,
            [
                notaId,
                item.produto_id,
                item.quantidade,
                item.preco_unitario
            ]
        );

        return resultado;
    },

    // Trava a nota até o fim da transação (evita duas alterações ao mesmo tempo)
    async BuscarParaAtualizar(conexao: PoolConnection, id: number): Promise<NotaBloqueada | null> {
        const [resultado] = await conexao.execute<NotaBloqueada[]>(
            `SELECT id, numero, status FROM nota WHERE id = ? FOR UPDATE`,
            [id]
        );

        return resultado[0] ?? null;
    },

    async Cancelar(conexao: PoolConnection, id: number): Promise<ResultSetHeader> {
        const [resultado] = await conexao.execute<ResultSetHeader>(
            `UPDATE nota SET status = 'cancelada' WHERE id = ?`,
            [id]
        );

        return resultado;
    },

    async AtualizarLink(conexao: PoolConnection, id: number, linkPdf: string | null): Promise<ResultSetHeader> {
        const [resultado] = await conexao.execute<ResultSetHeader>(
            `UPDATE nota SET link_pdf = ? WHERE id = ?`,
            [linkPdf, id]
        );

        return resultado;
    },

    // Todas as notas, da mais nova para a mais antiga, com o pedido e o cliente.
    // O valor da nota não fica guardado (atributo derivado): é a soma dos itens da nota.
    async Listar(): Promise<NotaListada[]> {
        const [resultado] = await db.execute<NotaListada[]>(
            `SELECT
                n.id,
                n.venda_id,
                v.pedido_id,
                u.nome AS cliente_nome,
                n.numero,
                n.natureza_operacao,
                (SELECT SUM(ni.quantidade * ni.preco_unitario) FROM nota_item ni WHERE ni.nota_id = n.id) AS valor_total,
                n.status,
                n.link_pdf,
                n.data_emissao
             FROM nota n
             INNER JOIN venda v ON v.id = n.venda_id
             INNER JOIN pedido p ON p.id = v.pedido_id
             INNER JOIN usuario u ON u.id = p.cliente_id
             ORDER BY n.data_emissao DESC, n.id DESC`
        );

        return resultado;
    }
};

export default NotaRepository;
