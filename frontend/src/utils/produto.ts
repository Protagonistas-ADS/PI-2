import type { SyntheticEvent } from "react";
import imagemPadrao from "../assets/PaleteBackground.png";

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

// 45 -> "R$ 45,00"
export function formatarPreco(valor: number) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}
