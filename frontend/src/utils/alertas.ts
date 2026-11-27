
import Swal from "sweetalert2";
import { toast } from "react-toastify";




// Swal
export function swalSucesso(mensagem: string) {
    return Swal.fire({
        title: "Sucesso!",
        text: mensagem,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#d97713",
    });
}

export function swalErro(mensagem: string) {
    return Swal.fire({
        title: "Erro!",
        text: mensagem,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d97713",
    });
}

export function swalAviso(mensagem: string) {
    return Swal.fire({
        title: "Atenção!",
        text: mensagem,
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#d97713",
    });
}

// Os textos dos botões podem mudar (ex.: "Sim, cancelar pedido" / "Voltar")
export function swalConfirmacao(mensagem: string, textoConfirmar = "Confirmar", textoVoltar = "Cancelar") {
    return Swal.fire({
        title: "Confirmação",
        text: mensagem,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: textoConfirmar,
        cancelButtonText: textoVoltar,
        confirmButtonColor: "#d97713",
        cancelButtonColor: "#6b7280",
    });
}


// Toastify
export function toastSucesso(mensagem: string) {
    toast.success(mensagem);
}

export function toastAviso(mensagem: string) {
    toast.warning(mensagem);
}

// Pergunta o número da nota fiscal ao marcar um pedido como entregue.
// Devolve o número digitado, ou null se o admin voltar.
export async function swalNumeroNota(mensagem: string, validar: (numero: string) => string) {
    const resposta = await Swal.fire({
        title: "Entregar pedido",
        text: mensagem,
        icon: "question",
        input: "text",
        inputLabel: "Número da nota fiscal *",
        inputPlaceholder: "Ex.: NF-000123",
        inputAttributes: { maxlength: "30", autocomplete: "off" },
        inputValidator: (valor) => validar(valor ?? "") || null,
        showCancelButton: true,
        confirmButtonText: "Sim, foi entregue",
        cancelButtonText: "Voltar",
        confirmButtonColor: "#d97713",
        cancelButtonColor: "#6b7280",
    });

    return resposta.isConfirmed ? String(resposta.value).trim() : null;
}
