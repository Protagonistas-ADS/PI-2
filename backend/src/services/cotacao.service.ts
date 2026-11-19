
import CotacaoRepository from "../repositories/cotacao.repository";
import { criarErro } from "../utils/criarErro";

const CotacaoService = {

    async ListarPorCliente(id: number) {
        if (!id) {
            throw criarErro("Identificação do cliente não informada.", 400);
        }

        const cotacoes = await CotacaoRepository.ListarPorCliente(id);

        return cotacoes;
    },

    async ListarItens(id: number, cliente_id: number) {
        if (!id || !cliente_id) {
            throw criarErro("Identificação da cotação ou cliente não informada.", 400);
        }

        const produtos = await CotacaoRepository.ListarItens(id, cliente_id);

        if (produtos.length === 0) {
            throw criarErro("Cotação não encontrada ou sem produtos.", 404);
        }

        const valorTotal = produtos.reduce(
            (total, produto) => total + Number(produto.subtotal ?? 0),
            0
        );

        return {
            produtos,
            valor_total: valorTotal
        };
    },

    async Cancelar(id: number, cliente_id: number) {
        if (!id || !cliente_id) {
            throw criarErro("Identificação da cotação ou cliente não informada.", 400);
        }

        const resultado = await CotacaoRepository.Cancelar(id, cliente_id);

        if (resultado.affectedRows === 0) {
            throw criarErro("Cotação não encontrada ou não pode ser cancelada.", 404);
        }
    },

    async MarcarComoLida(id: number, cliente_id: number) {
        if (!id || !cliente_id) {
            throw criarErro("Identificação da cotação ou cliente não informada.", 400);
        }

        const resultado = await CotacaoRepository.MarcarComoLida(id, cliente_id);

        if (resultado.affectedRows === 0) {
            throw criarErro("Cotação não encontrada ou já marcada como lida.", 404);
        }
    },

    async ConverterCotacao(id: number, cliente_id: number) {
        if (!id || !cliente_id) {
            throw criarErro("Identificação da cotação ou cliente não informada.", 400);
        }

        const resultado = await CotacaoRepository.ConverterCotacao(id, cliente_id);

        if (resultado.affectedRows === 0) {
            throw criarErro("Cotação não encontrada ou não pode ser convertida.", 404);
        }
    },

    async RecusarCotacao(id: number, cliente_id: number) {
        if (!id || !cliente_id) {
            throw criarErro("Identificação da cotação ou cliente não informada.", 400);
        }

        const resultado = await CotacaoRepository.RecusarCotacao(id, cliente_id);

        if (resultado.affectedRows === 0) {
            throw criarErro("Cotação não encontrada ou não pode ser recusada.", 404);
        }
    }

};

export default CotacaoService;
