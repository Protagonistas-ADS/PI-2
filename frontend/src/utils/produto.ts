import type { SyntheticEvent } from "react";
import imagemPadrao from "../assets/PaleteBackground.jpg";

// Monta o endereço da foto do produto, que fica na pasta uploads do backend.
// Sem foto cadastrada, mostra uma imagem padrão em vez de um ícone quebrado.
export function urlImagemProduto(imagem: string | null) {
    if (!imagem) {
        return imagemPadrao;
    }

    return `${import.meta.env.VITE_API_URL}/uploads/${imagem.replace(/^\/+/, "")}`;
}

// Usar no onError da <img>: se a foto não carregar, troca pela imagem padrão.
export function usarImagemPadrao(event: SyntheticEvent<HTMLImageElement>) {
    if (event.currentTarget.src !== imagemPadrao) {
        event.currentTarget.src = imagemPadrao;
    }
}

// Limite de unidades de um produto por pedido, só para evitar números absurdos na tela.
// Se passar do estoque, quem avisa é o servidor ao enviar o pedido (sem mostrar o número).
export const QUANTIDADE_MAXIMA_ITEM = 9999;

// Ex.: 65 -> "R$ 65,00"
export function formatarPreco(valor: number) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}
