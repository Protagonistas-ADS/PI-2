import db from "../configs/db";
import type { PoolConnection } from "mysql2/promise";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export type TipoMovimentacao = "entrada" | "saida";

export interface SaldoProduto extends RowDataPacket {
    id: number;
    nome: string;
    quantidade_estoque: number;
    ativo: boolean;
}

export interface Movimentacao extends RowDataPacket {
    id: number;
    produto_id: number;
    produto_nome: string;
    nota_id: number | null;
    tipo: TipoMovimentacao;
    quantidade: number;
    data_mov: Date;
}

interface ProdutoBloqueado extends RowDataPacket {
    id: number;
    quantidade_estoque: number;
}

const EstoqueRepository = {

    async ListarSaldos(): Promise<SaldoProduto[]> {
        const [resultado] = await db.execute<SaldoProduto[]>(`
            SELECT id, nome, quantidade_estoque, ativo
            FROM produto
            ORDER BY nome;
        `);

        return resultado;
    },

    async BuscarSaldoPorId(produtoId: number): Promise<SaldoProduto | null> {
        const [resultado] = await db.execute<SaldoProduto[]>(`
            SELECT id, nome, quantidade_estoque, ativo
            FROM produto
            WHERE id = ?;
        `, [produtoId]);

        return resultado[0] ?? null;
    },

    async ListarMovimentacoes(): Promise<Movimentacao[]> {
        const [resultado] = await db.execute<Movimentacao[]>(`
            SELECT
                m.id,
                m.produto_id,
                p.nome AS produto_nome,
                m.nota_id,
                m.tipo,
                m.quantidade,
                m.data_mov
            FROM movimentacao_estoque m
            INNER JOIN produto p ON p.id = m.produto_id
            ORDER BY m.data_mov DESC, m.id DESC;
        `);

        return resultado;
    },

    async ListarMovimentacoesPorProduto(produtoId: number): Promise<Movimentacao[]> {
        const [resultado] = await db.execute<Movimentacao[]>(`
            SELECT
                m.id,
                m.produto_id,
                p.nome AS produto_nome,
                m.nota_id,
                m.tipo,
                m.quantidade,
                m.data_mov
            FROM movimentacao_estoque m
            INNER JOIN produto p ON p.id = m.produto_id
            WHERE m.produto_id = ?
            ORDER BY m.data_mov DESC, m.id DESC;
        `, [produtoId]);

        return resultado;
    },

    // As funções abaixo recebem a conexão da transação aberta no service.

    // "FOR UPDATE" trava a linha do produto até o fim da transação,
    // impedindo que duas movimentações simultâneas leiam o mesmo saldo.
    async BuscarProdutoParaAtualizar(conexao: PoolConnection, produtoId: number): Promise<ProdutoBloqueado | null> {
        const [resultado] = await conexao.execute<ProdutoBloqueado[]>(`
            SELECT id, quantidade_estoque
            FROM produto
            WHERE id = ?
            FOR UPDATE;
        `, [produtoId]);

        return resultado[0] ?? null;
    },

    async AtualizarSaldo(conexao: PoolConnection, produtoId: number, novoSaldo: number): Promise<ResultSetHeader> {
        const [resultado] = await conexao.execute<ResultSetHeader>(`
            UPDATE produto
            SET quantidade_estoque = ?
            WHERE id = ?;
        `, [novoSaldo, produtoId]);

        return resultado;
    },

    async InserirMovimentacao(
        conexao: PoolConnection,
        produtoId: number,
        tipo: TipoMovimentacao,
        quantidade: number,
        notaId: number | null
    ): Promise<ResultSetHeader> {
        const [resultado] = await conexao.execute<ResultSetHeader>(`
            INSERT INTO movimentacao_estoque (produto_id, nota_id, tipo, quantidade)
            VALUES (?, ?, ?, ?);
        `, [produtoId, notaId, tipo, quantidade]);

        return resultado;
    }

};

export default EstoqueRepository;
