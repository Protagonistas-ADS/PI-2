// Formatos e filtros usados nas tabelas do administrador
// (Pedidos, Usuários, Movimentações, Vendas e Notas)

// "2026-11-21T03:00:00.000Z" -> "21/11/2026" (no horário do navegador)
export function formatarData(valor: string | null) {
    return valor ? new Date(valor).toLocaleDateString("pt-BR") : null;
}

// "2026-11-21T13:05:00.000Z" -> "21/11/2026 às 10:05"
export function formatarDataHora(valor: string) {
    const data = new Date(valor);
    const hora = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    return `${data.toLocaleDateString("pt-BR")} às ${hora}`;
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

// O dia de `valor` está entre `inicio` e `fim` ("AAAA-MM-DD"; vazio = sem limite)?
export function dentroDoPeriodo(valor: string, inicio: string, fim: string) {
    const dia = dataLocalAAAAMMDD(valor);

    if (inicio && dia < inicio) return false;
    if (fim && dia > fim) return false;

    return true;
}

// Busca sem diferenciar maiúsculas nem acentos ("JOÃO" encontra "joao")
export function normalizarBusca(texto: string) {
    return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

// "nº 12", "n 12" ou "12" -> "12" (o "nº" só sai se vier antes de um número,
// para não estragar nomes como "Natália")
export function termoDeBusca(texto: string) {
    return normalizarBusca(texto.replace(/^\s*n[ºo°.]?\s*(?=\d)/i, ""));
}

// Algum dos textos contém o termo? (termo vazio = tudo passa)
export function contemTermo(termo: string, ...textos: (string | number | null | undefined)[]) {
    if (!termo) return true;

    return textos.some((texto) => texto !== null && texto !== undefined && normalizarBusca(String(texto)).includes(termo));
}
