import type { ItemJanela, ItemPedido } from "../types/pedido";

// Converte os itens que a API devolve (GET /pedidos/:id/itens) no formato da janela de itens
export function paraItensJanela(itens: ItemPedido[]): ItemJanela[] {
    return itens.map((item) => ({
        produto: {
            id: item.produto_id,
            nome: item.produto_nome,
            preco_unitario: item.preco_unitario,
        },
        quantidade: item.quantidade,
    }));
}
