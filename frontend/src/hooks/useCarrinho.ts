import { useState, useEffect } from "react";
import type { Produto, ItemCarrinho } from "../types/produto";
import { swalAviso, toastSucesso } from "../utils/alertas";
import { QUANTIDADE_MAXIMA_ITEM } from "../utils/produto";

const CHAVE_CARRINHO = "carrinho";

// Lê o carrinho salvo no navegador e descarta itens antigos/estragados
// (versões anteriores salvavam produtos sem id, o que misturava os itens).
function carregarCarrinhoSalvo(): ItemCarrinho[] {
    try {
        const salvo = JSON.parse(localStorage.getItem(CHAVE_CARRINHO) ?? "[]");

        if (!Array.isArray(salvo)) return [];

        return salvo.filter((item) =>
            Number.isInteger(item?.produto?.id) && Number.isInteger(item?.quantidade) && item.quantidade > 0
        );
    } catch {
        return [];
    }
}

// Carrinho compartilhado entre o Catálogo e a página /carrinho.
// Fica guardado no navegador (localStorage): sobrevive a recarregar a página e ao login.
export function useCarrinho() {
    const [itens, setItens] = useState<ItemCarrinho[]>(carregarCarrinhoSalvo);

    useEffect(() => {
        localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
    }, [itens]);

    function adicionar(produto: Produto, quantidade: number) {
        const itemExistente = itens.find((item) => item.produto.id === produto.id);
        const quantidadeAtual = itemExistente?.quantidade ?? 0;

        if (!produto.disponivel) {
            swalAviso(`"${produto.nome}" está esgotado no momento.`);
            return;
        }

        // O estoque não é mostrado ao cliente: aqui só há o limite por pedido.
        // Se passar do estoque, o servidor avisa ao enviar o pedido.
        const quantidadeAdicionar = Math.min(quantidade, QUANTIDADE_MAXIMA_ITEM - quantidadeAtual);

        if (quantidadeAdicionar <= 0) {
            swalAviso(
                `O limite é de ${QUANTIDADE_MAXIMA_ITEM.toLocaleString("pt-BR")} unidades de "${produto.nome}" por pedido. ` +
                "Para quantidades maiores, fale com a loja pelo WhatsApp."
            );
            return;
        }

        setItens((atuais) => {
            if (itemExistente) {
                return atuais.map((item) =>
                    item.produto.id === produto.id
                        ? { ...item, quantidade: item.quantidade + quantidadeAdicionar }
                        : item
                );
            }

            return [...atuais, { produto, quantidade: quantidadeAdicionar }];
        });

        toastSucesso(`${quantidadeAdicionar}x ${produto.nome} adicionado ao carrinho.`);
    }

    function aumentar(id: number) {
        setItens((atuais) =>
            atuais.map((item) =>
                item.produto.id === id && item.quantidade < QUANTIDADE_MAXIMA_ITEM
                    ? { ...item, quantidade: item.quantidade + 1 }
                    : item
            )
        );
    }

    // Diminui a quantidade (remove quando chega a zero)
    function diminuir(id: number) {
        setItens((atuais) =>
            atuais.flatMap((item) => {
                if (item.produto.id !== id) return [item];
                if (item.quantidade <= 1) return [];
                return [{ ...item, quantidade: item.quantidade - 1 }];
            })
        );
    }

    function remover(id: number) {
        setItens((atuais) => atuais.filter((item) => item.produto.id !== id));
    }

    function limpar() {
        setItens([]);
    }

    // Atualiza preço e disponibilidade com os dados mais novos do catálogo.
    // Tira produtos que saíram do catálogo ou esgotaram. A quantidade não é comparada
    // com o estoque aqui (o cliente não sabe o número): o servidor confere ao enviar.
    // Devolve avisos em português para mostrar ao cliente.
    function sincronizar(produtosAtuais: Produto[]) {
        const avisos: string[] = [];

        const atualizados = itens.flatMap((item) => {
            const atual = produtosAtuais.find((produto) => produto.id === item.produto.id);

            if (!atual || !atual.disponivel) {
                avisos.push(`"${item.produto.nome}" não está mais disponível e saiu do carrinho.`);
                return [];
            }

            return [{ produto: atual, quantidade: Math.min(item.quantidade, QUANTIDADE_MAXIMA_ITEM) }];
        });

        setItens(atualizados);

        return avisos;
    }

    const totalItens = itens.reduce((total, item) => total + item.quantidade, 0);
    const valorTotal = itens.reduce((total, item) => total + item.produto.preco_unitario * item.quantidade, 0);

    return { itens, adicionar, aumentar, diminuir, remover, limpar, sincronizar, totalItens, valorTotal };
}
