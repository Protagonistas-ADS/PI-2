// Mesmos nomes e tipos que a API devolve em GET /produtos (tabela produto no banco).
// A quantidade em estoque não vem para o catálogo (é só do administrador):
// "disponivel" diz apenas se há estoque (true) ou se o produto está esgotado (false).
export interface Produto {
    readonly id: number;
    nome: string;
    descricao: string;
    preco_unitario: number;
    disponivel: boolean;
    imagem: string | null; // só o nome do arquivo; use urlImagemProduto() para exibir
    ativo: boolean;
}

export interface ItemCarrinho {
    produto: Produto;
    quantidade: number;
}
