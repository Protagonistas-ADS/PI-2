import type { PerfilUsuario } from "../types/usuario";

// Lembra para onde a pessoa volta depois de entrar na conta
// (ex.: saiu do carrinho para fazer login → volta para o carrinho).
// Fica no sessionStorage: some sozinho ao fechar a aba.
const CHAVE = "voltarAposLogin";

export function guardarDestinoAposLogin(caminho: string) {
    sessionStorage.setItem(CHAVE, caminho);
}

// Página inicial de cada perfil
export function paginaInicial(perfil: PerfilUsuario) {
    return perfil === "administrador" ? "/admin" : "/catalogo";
}

// Devolve o destino guardado (e apaga) ou a página inicial do perfil.
// Só aceita caminhos internos do site ("/carrinho"), nunca endereços de fora.
// O admin só volta para telas do painel; o cliente nunca é mandado para o painel.
export function obterDestinoAposLogin(perfil: PerfilUsuario) {
    const destino = sessionStorage.getItem(CHAVE);
    sessionStorage.removeItem(CHAVE);

    const interno = destino && destino.startsWith("/") && !destino.startsWith("//");
    const ehDoPainel = destino === "/admin" || destino?.startsWith("/admin/");

    if (interno && (perfil === "administrador") === Boolean(ehDoPainel)) {
        return destino;
    }

    return paginaInicial(perfil);
}

// Sai da conta (apaga o que o login guardou)
export function sairDaConta() {
    localStorage.removeItem("token");
    localStorage.removeItem("payload");
}
