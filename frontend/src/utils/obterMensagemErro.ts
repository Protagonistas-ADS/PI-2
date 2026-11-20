import axios from "axios";


export function obterMensagemErro(error: unknown, mensagemPadrao: string) {
    if (axios.isAxiosError(error)) {
        // O detalhe vem primeiro: ele diz exatamente o que está errado
        // (ex.: "Informe um e-mail válido"), em vez do genérico "Dados inválidos".
        const detalhe = error.response?.data?.detalhes?.[0]?.message;

        if (typeof detalhe === "string") {
            return detalhe;
        }

        const mensagem = error.response?.data?.erro;

        if (typeof mensagem === "string") {
            return mensagem;
        }

        if (!error.response) {
            return "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.";
        }
    }

    return mensagemPadrao;
}