
import CotacaoRepository from "../repositories/cotacao.repository";
import { criarErro } from "../utils/criarErro";

const CotacaoService = {

    async Criar(
        usuario: { id: number; perfil: "cliente" | "administrador" },
        dados: {
            cliente_id?: number;
            validade?: string;
            itens: { lote_id: number; quantidade: number }[];
        }
    ) {
        let clienteId: number;

        if (usuario.perfil === "administrador") {
            if (!dados.cliente_id) {
                throw criarErro(
                    "O administrador deve informar o cliente da cotação.",
                    400
                );
            }

            clienteId = dados.cliente_id;
        } else {
            clienteId = usuario.id;
        }

        const id = await CotacaoRepository.Criar({
            cliente_id: clienteId,
            validade: dados.validade ?? null,
            status: "pendente",
            itens: dados.itens
        });

        return { id };
    },

    async Listar(
        usuario: { id: number; perfil: "cliente" | "administrador" }
    ) {
        if (usuario.perfil === "administrador") {
            return await CotacaoRepository.Listar();
        }

        return await CotacaoRepository.Listar(usuario.id);
    },

    async BuscarPorId(
        id: number,
        usuario: { id: number; perfil: "cliente" | "administrador" }
    ) {
        const cotacao = await CotacaoRepository.BuscarPorId(id);

        if (!cotacao) {
            throw criarErro("Cotação não encontrada.", 404);
        }

        if (
            usuario.perfil !== "administrador" &&
            cotacao.cliente_id !== usuario.id
        ) {
            throw criarErro(
                "Você não possui permissão para visualizar esta cotação.",
                403
            );
        }

        return cotacao;
    },

    async Atualizar(
        id: number,
        dados: {
            validade?: string | null;
            status?: string;
            itens?: { lote_id: number; quantidade: number }[];
        }
    ) {
        const cotacao = await CotacaoRepository.BuscarPorId(id);

        if (!cotacao) {
            throw criarErro("Cotação não encontrada.", 404);
        }

        if (cotacao.status === "convertida") {
            throw criarErro(
                "Não é possível editar uma cotação convertida em pedido.",
                409
            );
        }

        await CotacaoRepository.Atualizar(id, dados);

        return { mensagem: "Cotação atualizada com sucesso." };
    },

    async Deletar(id: number) {
        const cotacao = await CotacaoRepository.BuscarPorId(id);

        if (!cotacao) {
            throw criarErro("Cotação não encontrada.", 404);
        }

        if (cotacao.status === "convertida") {
            throw criarErro(
                "Não é possível excluir uma cotação convertida em pedido.",
                409
            );
        }

        const possuiPedido = await CotacaoRepository.PossuiPedido(id);

        if (possuiPedido) {
            throw criarErro(
                "Não é possível excluir uma cotação vinculada a um pedido.",
                409
            );
        }

        await CotacaoRepository.Deletar(id);

        return { mensagem: "Cotação excluída com sucesso." };
    }
};

export default CotacaoService;
