
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

export function swalConfirmacao(mensagem: string) {
    return Swal.fire({
        title: "Confirmação",
        text: mensagem,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d97713",
        cancelButtonColor: "#6b7280",
    });
}


// Toastify
export function toastSucesso(mensagem: string) {
    toast.success(mensagem);
}

// Caso precise

// export function toastErro(mensagem: string) {
//     toast.error(mensagem);
// }

// export function toastAviso(mensagem: string) {
//     toast.warning(mensagem);
// }
