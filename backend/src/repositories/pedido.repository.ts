import db from "../configs/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface Pedido extends RowDataPacket {
    id: number;
    status: 'pendente' | 'respondido';
    previsao_busca: Date | null;
    quantidade_total: number;
}

export interface ItemPedido extends RowDataPacket {
    produtoId: number;
    produto_nome: string;
    quantidade: number;
    preco_unitario: number;
}

export interface NovoItemPedido {
    produtoId: number;
    quantidade: number;
}

interface ProdutoParaPedido extends RowDataPacket {
    id: number;
    preco_unitario: number;
    quantidade_estoque: number;
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

    async ListarItens(id: number, cliente_id: number): Promise<ItemPedido[]> {
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
        `, [id, cliente_id]);

        return resultado;
    },

    async Cancelar(id: number, cliente_id: number): Promise<ResultSetHeader> {
        const [resultado] = await db.execute<ResultSetHeader>(`
            UPDATE pedido
            SET status = 'cancelado'
            WHERE id = ?
              AND cliente_id = ?
              AND status IN ('pendente', 'respondido');
        `, [id, cliente_id]);

        return resultado;
    },

    async Criar(cliente_id: number, itens: NovoItemPedido[]) {
        const idsProdutos = itens.map((item) => item.produtoId);

        if (itens.length === 0) {
            throw new Error("O pedido precisa ter pelo menos um produto.");
        }

        if (new Set(idsProdutos).size !== idsProdutos.length) {
            throw new Error("Não é permitido repetir produtos no pedido.");
        }

        const conexao = await db.getConnection();

        try {
            await conexao.beginTransaction();

            const produtosEncontrados: ProdutoParaPedido[] = [];

            for (const item of itens) {
                if (!Number.isInteger(item.produtoId) || item.produtoId <= 0) {
                    throw new Error("Identificação de produto inválida.");
                }

                if (!Number.isInteger(item.quantidade) || item.quantidade <= 0) {
                    throw new Error("A quantidade deve ser um número inteiro positivo.");
                }
                const [resultado] = await conexao.execute<ProdutoParaPedido[]>(`
                SELECT 
                    id, 
                    preco_unitario, 
                    quantidade_estoque
                FROM produto
                WHERE id = ?
                    AND ativo = 1;
            `, [item.produtoId]);

                const produto = resultado[0];

                if (!produto) {
                    throw new Error(`Produto ${item.produtoId} não encontrado.`);
                }

                if (item.quantidade > produto.quantidade_estoque) {
                    throw new Error(`Estoque insuficiente para o produto ${produto.id}.`);
                }

                produtosEncontrados.push(produto);
            }

            const [resultadoPedido] = await conexao.execute<ResultSetHeader>(`
                INSERT INTO pedido (cliente_id)
                VALUES (?);
            `, [cliente_id]);

            const pedidoId = resultadoPedido.insertId;
            for (const item of itens) {
                const produto = produtosEncontrados.find(
                    (produto) => produto.id === item.produtoId
                );

                if (!produto) {
                    throw new Error("Produto não encontrado.");
                }

                const preco_unitario = Number(produto.preco_unitario);
                const subtotal = preco_unitario * item.quantidade;

                await conexao.execute(`
                    INSERT INTO pedido_item (
                        pedido_id,
                        produto_id,
                        quantidade,
                        preco_unitario,
                        subtotal
                        )
                    VALUES (?, ?, ?, ?, ?);
                `, [
                    pedidoId,
                    item.produtoId,
                    item.quantidade,
                    preco_unitario,
                    subtotal
                ]);
            }

            await conexao.commit();

            return pedidoId;

        } catch (error) {
            await conexao.rollback();
            throw error;
        } finally {
            conexao.release();
        }
    }
};

export default PedidoRepository;