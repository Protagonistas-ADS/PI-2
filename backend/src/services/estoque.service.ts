import type { PoolConnection } from "mysql2/promise";
import db from "../configs/db";
import EstoqueRepository, { TipoMovimentacao } from "../repositories/estoque.repository";
import { criarErro } from "../utils/criarErro";

// Maior valor aceito pela coluna INT do MySQL
const SALDO_MAXIMO = 2147483647;

function validarId(id: number, mensagem: string) {
    if (!Number.isInteger(id) || id <= 0) {
        throw criarErro(mensagem, 400);
    }
}

function validarQuantidade(quantidade: number) {
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        throw criarErro("A quantidade deve ser um número inteiro maior que zero.", 400);
    }
}

const EstoqueService = {

    async ListarSaldos() {
        return await EstoqueRepository.ListarSaldos();
    },

    async ListarMovimentacoes() {
        return await EstoqueRepository.ListarMovimentacoes();
    },

    async ListarMovimentacoesPorProduto(produtoId: number) {
        validarId(produtoId, "Identificação do produto inválida.");

        const produto = await EstoqueRepository.BuscarSaldoPorId(produtoId);

        if (!produto) {
            throw criarErro("Produto não encontrado.", 404);
        }

        const movimentacoes = await EstoqueRepository.ListarMovimentacoesPorProduto(produtoId);

        return { produto, movimentacoes };
    },

    async RegistrarEntrada(produtoId: number, quantidade: number) {
        return await EstoqueService.RegistrarMovimentacao("entrada", produtoId, quantidade);
    },

    async RegistrarSaida(produtoId: number, quantidade: number) {
        return await EstoqueService.RegistrarMovimentacao("saida", produtoId, quantidade);
    },

    /**
     * Atualiza o saldo do produto e grava o histórico da movimentação.
     *
     * Sem `conexaoExterna`, abre e fecha a própria transação.
     * Com `conexaoExterna` (ex.: futuro módulo de Venda/NF), usa a transação
     * de quem chamou: quem chamou é responsável pelo commit/rollback.
     */
    async RegistrarMovimentacao(
        tipo: TipoMovimentacao,
        produtoId: number,
        quantidade: number,
        notaId: number | null = null,
        conexaoExterna?: PoolConnection
    ) {
        validarId(produtoId, "Identificação do produto inválida.");
        validarQuantidade(quantidade);

        if (notaId !== null) {
            validarId(notaId, "Identificação da nota inválida.");
        }

        const gerenciaTransacao = conexaoExterna === undefined;
        const conexao = conexaoExterna ?? await db.getConnection();

        try {
            if (gerenciaTransacao) {
                await conexao.beginTransaction();
            }

            const produto = await EstoqueRepository.BuscarProdutoParaAtualizar(conexao, produtoId);

            if (!produto) {
                throw criarErro("Produto não encontrado.", 404);
            }

            const saldoAnterior = Number(produto.quantidade_estoque);
            const saldoAtual = tipo === "entrada"
                ? saldoAnterior + quantidade
                : saldoAnterior - quantidade;

            if (saldoAtual < 0) {
                throw criarErro(
                    `Estoque insuficiente. Saldo disponível: ${saldoAnterior}.`,
                    409
                );
            }

            if (saldoAtual > SALDO_MAXIMO) {
                throw criarErro("A entrada ultrapassa o limite de estoque do produto.", 400);
            }

            await EstoqueRepository.AtualizarSaldo(conexao, produtoId, saldoAtual);

            const movimentacao = await EstoqueRepository.InserirMovimentacao(
                conexao,
                produtoId,
                tipo,
                quantidade,
                notaId
            );

            if (gerenciaTransacao) {
                await conexao.commit();
            }

            return {
                movimentacao_id: movimentacao.insertId,
                produto_id: produtoId,
                tipo,
                quantidade,
                saldo_anterior: saldoAnterior,
                saldo_atual: saldoAtual
            };

        } catch (error) {
            if (gerenciaTransacao) {
                try {
                    await conexao.rollback();
                } catch (erroRollback) {
                    // Não esconde o erro original caso o rollback também falhe
                    console.error("Erro ao desfazer transação de estoque:", erroRollback);
                }
            }

            throw error;

        } finally {
            if (gerenciaTransacao) {
                conexao.release();
            }
        }
    }

};

export default EstoqueService;
