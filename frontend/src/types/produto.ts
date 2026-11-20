// Mesmos nomes e tipos que a API devolve em GET /produtos (tabela produto no banco).
export interface Produto {
    readonly id: number;
    nome: string;
    descricao: string;
    preco_unitario: number;
    quantidade_estoque: number;
    imagem: string | null; // só o nome do arquivo; use urlImagemProduto() para exibir
    ativo: boolean;
}

export interface ItemCarrinho {
    produto: Produto;
    quantidade: number;
}
