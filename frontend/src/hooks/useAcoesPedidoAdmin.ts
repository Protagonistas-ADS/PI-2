import { useState } from "react";

import { listarItensPedidoAdmin, alterarStatusPedido } from "../services/pedidoApi";
import type { PedidoComCliente, NovoStatusPedido, ItemJanela } from "../types/pedido";
import { MENSAGEM_SUCESSO } from "../utils/pedidoAdmin";
import { paraItensJanela } from "../utils/pedido";
import { obterMensagemErro } from "../utils/obterMensagemErro";
import { erroNumeroNota } from "../utils/notaFiscal";
import { swalConfirmacao, swalErro, swalNumeroNota, toastSucesso } from "../utils/alertas";

// Ações do administrador sobre um pedido (mudar status e ver itens).
// Usado no Dashboard e na tabela de Pedidos, para as duas telas agirem igual.
// `recarregar` é chamado depois de cada mudança (os números e a lista mudam).
export function useAcoesPedidoAdmin(recarregar: () => Promise<void>) {
    const [pedidoOcupado, setPedidoOcupado] = useState<number | null>(null);
    const [pedidoAberto, setPedidoAberto] = useState<{ id: number; itens: ItemJanela[] } | null>(null);

    async function mudarStatus(pedido: PedidoComCliente, novoStatus: NovoStatusPedido) {
        // Cancelar pede confirmação; entregar pede o número da nota (gera a venda e não volta)
        if (novoStatus === "cancelado") {
            const devolveEstoque = pedido.status !== "pendente";
            const resposta = await swalConfirmacao(
                `Cancelar o pedido nº ${pedido.id} de ${pedido.cliente_nome}?` +
                (devolveEstoque ? " Os produtos voltam para o estoque." : "") +
                " Isso não pode ser desfeito.",
                "Sim, cancelar pedido",
                "Voltar"
            );
            if (!resposta.isConfirmed) return;
        }

        // Entregar exige o número da nota fiscal: a venda e a nota nascem juntas
        let notaNumero: string | undefined;

        if (novoStatus === "entregue") {
            const numero = await swalNumeroNota(
                `Confirmar que o pedido nº ${pedido.id} foi retirado por ${pedido.cliente_nome}? ` +
                "Informe o número da nota fiscal emitida no Emitte. A venda será registrada com essa nota " +
                "e o pedido não poderá mais ser alterado.",
                erroNumeroNota
            );
            if (!numero) return;
            notaNumero = numero;
        }

        setPedidoOcupado(pedido.id);

        try {
            await alterarStatusPedido(pedido.id, novoStatus, notaNumero);
            toastSucesso(
                notaNumero
                    ? `Pedido nº ${pedido.id} entregue (venda registrada com a nota ${notaNumero}).`
                    : `Pedido nº ${pedido.id} ${MENSAGEM_SUCESSO[novoStatus]}.`
            );
        } catch (error) {
            swalErro(obterMensagemErro(error, "Não foi possível alterar o status do pedido."));
        } finally {
            // Recarrega sempre: os números e a lista mudam (e outro admin pode ter mexido)
            await recarregar();
            setPedidoOcupado(null);
        }
    }

    async function abrirItens(id: number) {
        try {
            const produtos = await listarItensPedidoAdmin(id);

            const itens = paraItensJanela(produtos);

            setPedidoAberto({ id, itens });
        } catch (error) {
            swalErro(obterMensagemErro(error, "Não foi possível abrir os itens do pedido."));
        }
    }

    return {
        pedidoOcupado,
        mudarStatus,
        pedidoAberto,
        abrirItens,
        fecharItens: () => setPedidoAberto(null)
    };
}
