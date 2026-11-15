import axios from "axios";


export function obterMensagemErro(error: unknown, mensagemPadrao: string) {
    if (axios.isAxiosError(error)) {
        const mensagem = error.response?.data?.erro;

        if (typeof mensagem === "string") {
            return mensagem;
        }

        const detalhe = error.response?.data?.detalhes?.[0]?.message;

        if (typeof detalhe === "string") {
            return detalhe;
        }
    }

    return mensagemPadrao;
}