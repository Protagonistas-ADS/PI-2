import type { NovoStatusPedido, StatusPedido } from "../types/pedido";

// Regras de tela dos pedidos do administrador (usadas no Dashboard e na tabela de Pedidos)

// Pedidos que ainda precisam de alguma ação da loja
export type StatusEmAndamento = "pendente" | "confirmado" | "pronto_retirada";
export const STATUS_EM_ANDAMENTO: StatusEmAndamento[] = ["pendente", "confirmado", "pronto_retirada"];

// Próximo passo de cada status (o mesmo fluxo que o backend aceita)
export const PROXIMO_PASSO: Record<StatusEmAndamento, { status: NovoStatusPedido; texto: string }> = {
    pendente: { status: "confirmado", texto: "Confirmar" },
    confirmado: { status: "pronto_retirada", texto: "Marcar pronto" },
    pronto_retirada: { status: "entregue", texto: "Entregue" }
};

export const MENSAGEM_SUCESSO: Record<NovoStatusPedido, string> = {
    confirmado: "confirmado (estoque baixado)",
    pronto_retirada: "marcado como pronto para retirada",
    entregue: "entregue (venda registrada)",
    cancelado: "cancelado"
};

export function emAndamento(status: StatusPedido): status is StatusEmAndamento {
    return (STATUS_EM_ANDAMENTO as StatusPedido[]).includes(status);
}

// "2026-11-21T03:00:00.000Z" -> "21/11/2026" (no horário do navegador)
export function formatarData(valor: string | null) {
    return valor ? new Date(valor).toLocaleDateString("pt-BR") : null;
}

export function ehHoje(valor: string | null) {
    return valor !== null && formatarData(valor) === new Date().toLocaleDateString("pt-BR");
}

// "2026-11-21T03:00:00.000Z" -> "2026-11-21" no horário do navegador
// (mesmo formato do campo de data, para comparar períodos)
export function dataLocalAAAAMMDD(valor: string) {
    const data = new Date(valor);
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

// Busca sem diferenciar maiúsculas nem acentos ("JOÃO" encontra "joao")
export function normalizarBusca(texto: string) {
    return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}
