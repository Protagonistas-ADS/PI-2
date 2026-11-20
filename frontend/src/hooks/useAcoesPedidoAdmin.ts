import { useState } from "react";

import { listarItensPedidoAdmin, alterarStatusPedido } from "../services/pedidoApi";
import type { PedidoComCliente, NovoStatusPedido } from "../types/pedido";
import { MENSAGEM_SUCESSO } from "../utils/pedidoAdmin";
import { obterMensagemErro } from "../utils/obterMensagemErro";
import { swalConfirmacao, swalErro, toastSucesso } from "../utils/alertas";

// Formato que a janela de itens (ModalCarrinho) espera
interface ItemJanela {
    produto: { id: number; nome: string; preco_unitario: number };
    quantidade: number;
}

// Ações do administrador sobre um pedido (mudar status e ver itens).
// Usado no Dashboard e na tabela de Pedidos, para as duas telas agirem igual.
// `recarregar` é chamado depois de cada mudança (os números e a lista mudam).
export function useAcoesPedidoAdmin(recarregar: () => Promise<void>) {
    const [pedidoOcupado, setPedidoOcupado] = useState<number | null>(null);
    const [pedidoAberto, setPedidoAberto] = useState<{ id: number; itens: ItemJanela[] } | null>(null);

    async function mudarStatus(pedido: PedidoComCliente, novoStatus: NovoStatusPedido) {
        // Cancelar e entregar pedem confirmação (entregar gera a venda e não volta)
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

        if (novoStatus === "entregue") {
            const resposta = await swalConfirmacao(
                `Confirmar que o pedido nº ${pedido.id} foi retirado por ${pedido.cliente_nome}? ` +
                "A venda será registrada e o pedido não poderá mais ser alterado.",
                "Sim, foi entregue",
                "Voltar"
            );
            if (!resposta.isConfirmed) return;
        }

        setPedidoOcupado(pedido.id);

        try {
            await alterarStatusPedido(pedido.id, novoStatus);
            toastSucesso(`Pedido nº ${pedido.id} ${MENSAGEM_SUCESSO[novoStatus]}.`);
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

            const itens = produtos.map((produto) => ({
                produto: {
                    id: produto.produto_id,
                    nome: produto.produto_nome,
                    preco_unitario: produto.preco_unitario
                },
                quantidade: produto.quantidade
            }));

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
