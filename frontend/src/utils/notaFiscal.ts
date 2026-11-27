// Regras do número da nota fiscal: as mesmas do backend
// (que confere de novo: é ele que protege de verdade).
export function erroNumeroNota(numero: string) {
    if (!numero.trim()) return "Informe o número da nota fiscal.";
    if (numero.trim().length > 30) return "O número deve ter no máximo 30 caracteres.";
    if (!/^[A-Za-z0-9./-]+$/.test(numero.trim())) return "Use só letras, números, ponto, barra ou hífen.";
    return "";
}
