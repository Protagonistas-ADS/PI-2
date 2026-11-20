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

// Mesmos nomes que a API devolve (e o frontend usa)
export interface Movimentacao extends RowDataPacket {
    id: number;
    produto_id: number;
    produto_nome: string;
    pedido_id: number | null;
    usuario_id: number | null;
    responsavel_nome: string | null;
    tipo: TipoMovimentacao;
    quantidade: number;
    motivo: string | null;
    data_mov: Date;
}

// De onde veio a movimentação: quem fez, por quê e (se houver) de qual pedido
export interface OrigemMovimentacao {
    usuarioId: number;
    motivo: string;
    pedidoId?: number | null;
}

interface ProdutoBloqueado extends RowDataPacket {
    id: number;
    quantidade_estoque: number;
}

// Colunas do histórico: o responsável vem da tabela usuario (LEFT JOIN porque
// movimentações antigas, de antes da migração, podem não ter responsável)
const CAMPOS_MOVIMENTACAO = `
    m.id,
    m.produto_id,
    p.nome AS produto_nome,
    m.pedido_id,
    m.usuario_id,
    u.nome AS responsavel_nome,
    m.tipo,
    m.quantidade,
    m.motivo,
    m.data_mov
`;

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
            SELECT ${CAMPOS_MOVIMENTACAO}
            FROM movimentacao_estoque m
            INNER JOIN produto p ON p.id = m.produto_id
            LEFT JOIN usuario u ON u.id = m.usuario_id
            ORDER BY m.data_mov DESC, m.id DESC;
        `);

        return resultado;
    },

    async ListarMovimentacoesPorProduto(produtoId: number): Promise<Movimentacao[]> {
        const [resultado] = await db.execute<Movimentacao[]>(`
            SELECT ${CAMPOS_MOVIMENTACAO}
            FROM movimentacao_estoque m
            INNER JOIN produto p ON p.id = m.produto_id
            LEFT JOIN usuario u ON u.id = m.usuario_id
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
        origem: OrigemMovimentacao
    ): Promise<ResultSetHeader> {
        const [resultado] = await conexao.execute<ResultSetHeader>(`
            INSERT INTO movimentacao_estoque (produto_id, pedido_id, usuario_id, tipo, quantidade, motivo)
            VALUES (?, ?, ?, ?, ?, ?);
        `, [produtoId, origem.pedidoId ?? null, origem.usuarioId, tipo, quantidade, origem.motivo]);

        return resultado;
    }

};

export default EstoqueRepository;
