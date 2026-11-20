import type { NovoStatusPedido, StatusPedido } from "../types/pedido";
import { formatarData } from "./filtrosAdmin";

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

export function ehHoje(valor: string | null) {
    return valor !== null && formatarData(valor) === new Date().toLocaleDateString("pt-BR");
}
