
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

    async ListarItens(id: number, clienteId: number) {
        if (!id || !clienteId) {
            throw criarErro("Identificação da cotação ou cliente não informada.", 400);
        }

        const produtos = await CotacaoRepository.ListarItens(id, clienteId);

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
    }

};

export default CotacaoService;
