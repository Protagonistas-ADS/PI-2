
import db from "../configs/db";
import NotaRepository from "../repositories/nota.repository";
import { criarErro } from "../utils/criarErro";

const NotaService = {
    async Criar(
        vendaId: number,
        numero: string,
        naturezaOperacao: string = "Venda de mercadoria"
    ) {
        if (!Number.isInteger(vendaId) || vendaId <= 0) {
            throw criarErro("Identificação da venda inválida.", 400);
        }

        if (!numero || !numero.trim()) {
            throw criarErro("O número da nota fiscal é obrigatório.", 400);
        }

        const conexao = await db.getConnection();

        try {
            await conexao.beginTransaction();

            const venda = await NotaRepository.BuscarVenda(conexao, vendaId);

            if (!venda) {
                throw criarErro("Venda não encontrada.", 404);
            }

            const notaExistente = await NotaRepository.VerificarNotaExistente(
                conexao,
                vendaId
            );

            if (notaExistente) {
                throw criarErro("Esta venda já possui uma nota fiscal.", 409);
            }

            const itens = await NotaRepository.BuscarItensVenda(
                conexao,
                vendaId
            );

            if (itens.length === 0) {
                throw criarErro("A venda não possui produtos.", 400);
            }

            const resultadoNota = await NotaRepository.Criar(
                conexao,
                vendaId,
                numero.trim(),
                naturezaOperacao.trim(),
                Number(venda.valor_total)
            );

            for (const item of itens) {
                await NotaRepository.CriarItem(
                    conexao,
                    resultadoNota.insertId,
                    item
                );
            }

            await conexao.commit();

            return {
                nota_id: resultadoNota.insertId,
                venda_id: vendaId,
                numero: numero.trim(),
                valor_total: Number(venda.valor_total),
                quantidade_itens: itens.length
            };

        } catch (error) {
            await conexao.rollback();
            throw error;
        } finally {
            conexao.release();
        }
    },

    async Listar() {
        return NotaRepository.Listar();
    }
};

export default NotaService;
