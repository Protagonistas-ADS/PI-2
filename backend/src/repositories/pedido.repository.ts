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
    produtoNome: string;
    quantidade: number;
    precoUnitario: number;
}

export interface NovoItemPedido {
    produtoId: number;
    quantidade: number;
}

interface ProdutoParaPedido extends RowDataPacket {
    id: number;
    precoUnitario: number;
    quantidadeEstoque: number;
}

const PedidoRepository = {

    async ListarPorCliente(id: number): Promise<Pedido[]> {
        const [resultado] = await db.execute<Pedido[]>(`
            SELECT
                p.id,
                p.status,
                p.previsao_busca AS previsaoBusca,
                SUM(pi.quantidade) AS quantidadeTotal
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
                pi.produto_id AS produtoId,
                p.nome AS produtoNome,
                pi.quantidade,
                pi.preco_unitario AS precoUnitario
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
    },

    async Criar(clienteId: number, itens: NovoItemPedido[]) {
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
                    preco_unitario AS precoUnitario, 
                    quantidade_estoque AS quantidadeEstoque
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
            `, [clienteId]);

            const pedidoId = resultadoPedido.insertId;
            for (const item of itens) {
                const produto = produtosEncontrados.find(
                    (produto) => produto.id === item.produtoId
                );

                if (!produto) {
                    throw new Error("Produto não encontrado.");
                }

                const precoUnitario = Number(produto.preco_unitario);
                const subtotal = precoUnitario * item.quantidade;

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
                    precoUnitario,
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