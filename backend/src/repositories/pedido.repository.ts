import db from "../configs/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import type { PoolConnection } from "mysql2/promise";
import type { StatusPedido } from "../schemas/pedido.schema";

// Mesmos nomes das colunas do banco (e do que o frontend recebe).
export interface Pedido extends RowDataPacket {
    id: number;
    status: StatusPedido;
    previsao_busca: Date | null;
    observacao: string | null;
    criado_em: Date;
    quantidade_total: number;
    valor_total: number;
}

export interface PedidoComCliente extends Pedido {
    cliente_id: number;
    cliente_nome: string;
    cliente_email: string;
}

export interface ItemPedido extends RowDataPacket {
    produto_id: number;
    produto_nome: string;
    quantidade: number;
    preco_unitario: number;
    subtotal: number;
}

export interface PedidoBloqueado extends RowDataPacket {
    id: number;
    cliente_id: number;
    status: StatusPedido;
}

export interface ProdutoParaPedido extends RowDataPacket {
    id: number;
    nome: string;
    preco_unitario: number;
    quantidade_estoque: number;
    ativo: number;
}

// Colunas e totais usados nas duas listagens (cliente e administrador).
// Subtotal e total não ficam guardados no banco (atributos derivados): são calculados aqui.
const CAMPOS_PEDIDO = `
    p.id,
    p.status,
    p.previsao_busca,
    p.observacao,
    p.criado_em,
    SUM(pi.quantidade) AS quantidade_total,
    SUM(pi.quantidade * pi.preco_unitario) AS valor_total
`;

const PedidoRepository = {

    async ListarPorCliente(cliente_id: number): Promise<Pedido[]> {
        const [resultado] = await db.execute<Pedido[]>(`
            SELECT ${CAMPOS_PEDIDO}
            FROM pedido p
            INNER JOIN pedido_item pi ON pi.pedido_id = p.id
            WHERE p.cliente_id = ?
            GROUP BY p.id
            ORDER BY p.id DESC;
        `, [cliente_id]);

        return resultado;
    },

    async ListarTodos(): Promise<PedidoComCliente[]> {
        const [resultado] = await db.execute<PedidoComCliente[]>(`
            SELECT
                ${CAMPOS_PEDIDO},
                u.id AS cliente_id,
                u.nome AS cliente_nome,
                u.email AS cliente_email
            FROM pedido p
            INNER JOIN pedido_item pi ON pi.pedido_id = p.id
            INNER JOIN usuario u ON u.id = p.cliente_id
            GROUP BY p.id, u.id
            ORDER BY p.id DESC;
        `);

        return resultado;
    },

    // Itens de um pedido do próprio cliente (pedido de outro cliente volta vazio)
    async ListarItens(id: number, cliente_id: number): Promise<ItemPedido[]> {
        const [resultado] = await db.execute<ItemPedido[]>(`
            SELECT
                pi.produto_id,
                p.nome AS produto_nome,
                pi.quantidade,
                pi.preco_unitario,
                pi.quantidade * pi.preco_unitario AS subtotal
            FROM pedido_item pi
            INNER JOIN produto p ON p.id = pi.produto_id
            INNER JOIN pedido pe ON pe.id = pi.pedido_id
            WHERE pe.id = ?
              AND pe.cliente_id = ?;
        `, [id, cliente_id]);

        return resultado;
    },

    // Status e dono do pedido, sem trava (para montar mensagens de erro)
    // Itens de qualquer pedido (uso do administrador)
    async ListarItensDoPedido(id: number): Promise<ItemPedido[]> {
        const [resultado] = await db.execute<ItemPedido[]>(`
            SELECT
                pi.produto_id,
                p.nome AS produto_nome,
                pi.quantidade,
                pi.preco_unitario,
                pi.quantidade * pi.preco_unitario AS subtotal
            FROM pedido_item pi
            INNER JOIN produto p ON p.id = pi.produto_id
            WHERE pi.pedido_id = ?;
        `, [id]);

        return resultado;
    },

    async BuscarResumo(id: number): Promise<PedidoBloqueado | null> {
        const [resultado] = await db.execute<PedidoBloqueado[]>(`
            SELECT id, cliente_id, status
            FROM pedido
            WHERE id = ?;
        `, [id]);

        return resultado[0] ?? null;
    },

    // O cliente só cancela enquanto o pedido está pendente (o estoque ainda não baixou)
    async CancelarPendente(id: number, cliente_id: number): Promise<ResultSetHeader> {
        const [resultado] = await db.execute<ResultSetHeader>(`
            UPDATE pedido
            SET status = 'cancelado'
            WHERE id = ?
              AND cliente_id = ?
              AND status = 'pendente';
        `, [id, cliente_id]);

        return resultado;
    },

    // As funções abaixo recebem a conexão da transação aberta no service.

    async BuscarProduto(conexao: PoolConnection, produto_id: number): Promise<ProdutoParaPedido | null> {
        const [resultado] = await conexao.execute<ProdutoParaPedido[]>(`
            SELECT id, nome, preco_unitario, quantidade_estoque, ativo
            FROM produto
            WHERE id = ?;
        `, [produto_id]);

        return resultado[0] ?? null;
    },

    async Inserir(
        conexao: PoolConnection,
        cliente_id: number,
        previsao_busca: string | null,
        observacao: string | null
    ): Promise<number> {
        const [resultado] = await conexao.execute<ResultSetHeader>(`
            INSERT INTO pedido (cliente_id, previsao_busca, observacao)
            VALUES (?, ?, ?);
        `, [cliente_id, previsao_busca, observacao]);

        return resultado.insertId;
    },

    async InserirItem(
        conexao: PoolConnection,
        pedido_id: number,
        produto_id: number,
        quantidade: number,
        preco_unitario: number
    ): Promise<void> {
        await conexao.execute(`
            INSERT INTO pedido_item (pedido_id, produto_id, quantidade, preco_unitario)
            VALUES (?, ?, ?, ?);
        `, [pedido_id, produto_id, quantidade, preco_unitario]);
    },

    // "FOR UPDATE" trava o pedido até o fim da transação:
    // dois cliques ao mesmo tempo não confirmam (nem baixam o estoque) duas vezes.
    async BuscarParaAtualizar(conexao: PoolConnection, id: number): Promise<PedidoBloqueado | null> {
        const [resultado] = await conexao.execute<PedidoBloqueado[]>(`
            SELECT id, cliente_id, status
            FROM pedido
            WHERE id = ?
            FOR UPDATE;
        `, [id]);

        return resultado[0] ?? null;
    },

    async ListarItensParaEstoque(conexao: PoolConnection, id: number): Promise<ItemPedido[]> {
        const [resultado] = await conexao.execute<ItemPedido[]>(`
            SELECT
                pi.produto_id,
                p.nome AS produto_nome,
                pi.quantidade,
                pi.preco_unitario,
                pi.quantidade * pi.preco_unitario AS subtotal
            FROM pedido_item pi
            INNER JOIN produto p ON p.id = pi.produto_id
            WHERE pi.pedido_id = ?;
        `, [id]);

        return resultado;
    },

    async AtualizarStatus(conexao: PoolConnection, id: number, status: StatusPedido): Promise<void> {
        await conexao.execute(`
            UPDATE pedido
            SET status = ?
            WHERE id = ?;
        `, [status, id]);
    }
};

export default PedidoRepository;
