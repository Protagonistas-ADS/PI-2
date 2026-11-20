import { useState, useEffect } from "react";
import type { Produto, ItemCarrinho } from "../types/produto";
import { swalAviso, toastSucesso } from "../utils/alertas";

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

        // Impede ultrapassar o estoque disponível
        const quantidadeAdicionar = Math.min(quantidade, produto.quantidade_estoque - quantidadeAtual);

        if (quantidadeAdicionar <= 0) {
            swalAviso(`Você já tem todo o estoque de "${produto.nome}" no carrinho (${quantidadeAtual}).`);
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
                item.produto.id === id && item.quantidade < item.produto.quantidade_estoque
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

    // Atualiza preço e estoque com os dados mais novos do catálogo.
    // Tira produtos que saíram do catálogo e reduz quantidades acima do estoque.
    // Devolve avisos em português para mostrar ao cliente.
    function sincronizar(produtosAtuais: Produto[]) {
        const avisos: string[] = [];

        const atualizados = itens.flatMap((item) => {
            const atual = produtosAtuais.find((produto) => produto.id === item.produto.id);

            if (!atual || atual.quantidade_estoque <= 0) {
                avisos.push(`"${item.produto.nome}" não está mais disponível e saiu do carrinho.`);
                return [];
            }

            if (item.quantidade > atual.quantidade_estoque) {
                avisos.push(`"${atual.nome}": só há ${atual.quantidade_estoque} em estoque; a quantidade foi ajustada.`);
                return [{ produto: atual, quantidade: atual.quantidade_estoque }];
            }

            return [{ produto: atual, quantidade: item.quantidade }];
        });

        setItens(atualizados);

        return avisos;
    }

    const totalItens = itens.reduce((total, item) => total + item.quantidade, 0);
    const valorTotal = itens.reduce((total, item) => total + item.produto.preco_unitario * item.quantidade, 0);

    return { itens, adicionar, aumentar, diminuir, remover, limpar, sincronizar, totalItens, valorTotal };
}
