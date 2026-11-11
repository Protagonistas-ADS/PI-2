
import db from "../configs/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

export interface ItemCotacao {
    lote_id: number;
    quantidade: number;
}

export interface DadosCotacao {
    cliente_id: number;
    validade?: string | null;
    status?: string;
    itens: ItemCotacao[];
}

interface Cotacao extends RowDataPacket {
    id: number;
    cliente_id: number;
    validade: Date | null;
    status: string;
    criado_em: Date;
}

interface Lote extends RowDataPacket {
    id: number;
    preco_unitario: number;
    ativo: number;
}

export interface Item extends RowDataPacket {
    id: number;
    cotacao_id: number;
    lote_id: number;
    nome: string;
    quantidade: number;
    preco_unitario: number;
    subtotal: number;
}

const CotacaoRepository = {

    async Criar(dados: DadosCotacao) {
        const conexao = await db.getConnection();

        try {
            await conexao.beginTransaction();

            const [resultado] = await conexao.execute<ResultSetHeader>(
                `INSERT INTO cotacao (cliente_id, validade, status)
                 VALUES (?, ?, ?)`,
                [
                    dados.cliente_id,
                    dados.validade ?? null,
                    dados.status ?? "pendente"
                ]
            );

            const cotacaoId = resultado.insertId;

            for (const item of dados.itens) {
                const [lotes] = await conexao.execute<Lote[]>(
                    `SELECT id, preco_unitario, ativo
                     FROM lote
                     WHERE id = ?
                     FOR UPDATE`,
                    [item.lote_id]
                );

                const lote = lotes[0];

                if (!lote || !lote.ativo) {
                    throw new Error(
                        `Lote ${item.lote_id} não encontrado ou inativo.`
                    );
                }

                const preco = Number(lote.preco_unitario);
                const subtotal = preco * item.quantidade;

                await conexao.execute(
                    `INSERT INTO cotacao_item
                    (cotacao_id, lote_id, quantidade, preco_unitario, subtotal)
                    VALUES (?, ?, ?, ?, ?)`,
                    [
                        cotacaoId,
                        item.lote_id,
                        item.quantidade,
                        preco,
                        subtotal
                    ]
                );
            }

            await conexao.commit();

            return cotacaoId;

        } catch (error) {
            await conexao.rollback();
            throw error;

        } finally {
            conexao.release();
        }
    },

    async Listar(clienteId?: number) {
        let sql = `
            SELECT
                c.id,
                c.cliente_id,
                c.validade,
                c.status,
                c.criado_em,
                u.nome AS cliente_nome,
                u.email AS cliente_email
            FROM cotacao c
            INNER JOIN usuario u ON u.id = c.cliente_id
        `;

        const parametros: number[] = [];

        if (clienteId !== undefined) {
            sql += " WHERE c.cliente_id = ?";
            parametros.push(clienteId);
        }

        sql += " ORDER BY c.criado_em DESC";

        const [cotacoes] = await db.execute<Cotacao[]>(sql, parametros);

        if (cotacoes.length === 0) {
            return [];
        }

        const ids = cotacoes.map(c => c.id);
        const placeholders = ids.map(() => "?").join(", ");

        const [itens] = await db.execute<Item[]>(
            `SELECT
                ci.id,
                ci.cotacao_id,
                ci.lote_id,
                l.nome,
                ci.quantidade,
                ci.preco_unitario,
                ci.subtotal
             FROM cotacao_item ci
             INNER JOIN lote l ON l.id = ci.lote_id
             WHERE ci.cotacao_id IN (${placeholders})`,
            ids
        );

        return cotacoes.map(cotacao => ({
            ...cotacao,
            itens: itens.filter(
                item => item.cotacao_id === cotacao.id
            )
        }));
    },

    async BuscarPorId(id: number) {
        const [cotacoes] = await db.execute<Cotacao[]>(
            `SELECT
                c.id,
                c.cliente_id,
                c.validade,
                c.status,
                c.criado_em,
                u.nome AS cliente_nome,
                u.email AS cliente_email
             FROM cotacao c
             INNER JOIN usuario u ON u.id = c.cliente_id
             WHERE c.id = ?`,
            [id]
        );

        const cotacao = cotacoes[0];

        if (!cotacao) {
            return null;
        }

        const [itens] = await db.execute<Item[]>(
            `SELECT
                ci.id,
                ci.cotacao_id,
                ci.lote_id,
                l.nome,
                ci.quantidade,
                ci.preco_unitario,
                ci.subtotal
             FROM cotacao_item ci
             INNER JOIN lote l ON l.id = ci.lote_id
             WHERE ci.cotacao_id = ?`,
            [id]
        );

        return {
            ...cotacao,
            itens
        };
    },

    async BuscarPorIdTransacao(
        id: number,
        conexao: PoolConnection
    ) {
        const [cotacoes] = await conexao.execute<Cotacao[]>(
            `SELECT id, cliente_id, validade, status
             FROM cotacao
             WHERE id = ?
             FOR UPDATE`,
            [id]
        );

        return cotacoes[0] ?? null;
    },

    async Atualizar(
        id: number,
        dados: {
            validade?: string | null;
            status?: string;
            itens?: ItemCotacao[];
        }
    ) {
        const conexao = await db.getConnection();

        try {
            await conexao.beginTransaction();

            const cotacao = await this.BuscarPorIdTransacao(id, conexao);

            if (!cotacao) {
                throw new Error("Cotação não encontrada.");
            }

            if (cotacao.status === "convertida") {
                throw new Error("Não é possível editar uma cotação convertida em pedido.");
            }

            const campos: string[] = [];
            const valores: (string | null)[] = [];

            if (dados.validade !== undefined) {
                campos.push("validade = ?");
                valores.push(dados.validade);
            }

            if (dados.status !== undefined) {
                campos.push("status = ?");
                valores.push(dados.status);
            }

            if (campos.length > 0) {
                valores.push(String(id));

                await conexao.execute(
                    `UPDATE cotacao
                     SET ${campos.join(", ")}
                     WHERE id = ?`,
                    valores
                );
            }

            if (dados.itens !== undefined) {
                await conexao.execute(
                    "DELETE FROM cotacao_item WHERE cotacao_id = ?",
                    [id]
                );

                for (const item of dados.itens) {
                    const [lotes] = await conexao.execute<Lote[]>(
                        `SELECT id, preco_unitario, ativo
                         FROM lote
                         WHERE id = ?
                         FOR UPDATE`,
                        [item.lote_id]
                    );

                    const lote = lotes[0];

                    if (!lote || !lote.ativo) {
                        throw new Error(
                            `Lote ${item.lote_id} não encontrado ou inativo.`
                        );
                    }

                    const preco = Number(lote.preco_unitario);

                    await conexao.execute(
                        `INSERT INTO cotacao_item
                        (cotacao_id, lote_id, quantidade, preco_unitario, subtotal)
                        VALUES (?, ?, ?, ?, ?)`,
                        [
                            id,
                            item.lote_id,
                            item.quantidade,
                            preco,
                            preco * item.quantidade
                        ]
                    );
                }
            }

            await conexao.commit();

        } catch (error) {
            await conexao.rollback();
            throw error;

        } finally {
            conexao.release();
        }
    },

    async Deletar(id: number) {
        const [resultado] = await db.execute<ResultSetHeader>(
            `DELETE FROM cotacao
             WHERE id = ?`,
            [id]
        );

        return resultado.affectedRows > 0;
    },

    async PossuiPedido(id: number): Promise<boolean> {
        const [resultado] = await db.execute<RowDataPacket[]>(
            `SELECT id FROM pedido WHERE cotacao_id = ? LIMIT 1`,
            [id]
        );

        return resultado.length > 0;
    }
};

export default CotacaoRepository;
