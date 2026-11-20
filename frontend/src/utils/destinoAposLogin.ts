// Lembra para onde a pessoa volta depois de entrar na conta
// (ex.: saiu do carrinho para fazer login → volta para o carrinho).
// Fica no sessionStorage: some sozinho ao fechar a aba.
const CHAVE = "voltarAposLogin";

export function guardarDestinoAposLogin(caminho: string) {
    sessionStorage.setItem(CHAVE, caminho);
}

// Devolve o destino guardado (e apaga) ou o catálogo.
// Só aceita caminhos internos do site ("/carrinho"), nunca endereços de fora.
export function obterDestinoAposLogin() {
    const destino = sessionStorage.getItem(CHAVE);
    sessionStorage.removeItem(CHAVE);

    if (destino && destino.startsWith("/") && !destino.startsWith("//")) {
        return destino;
    }

    return "/catalogo";
}
