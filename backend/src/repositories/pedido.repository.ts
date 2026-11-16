import db from "../configs/db";

const PedidoRepository = {

    async ListarDoCliente(id: number) {
        const [resultado] = await db.execute(`
            SELECT
                p.id,
                p.status,
                p.previsao_busca,
                pi.produto_id,
                pi.quantidade
            FROM pedido p
            INNER JOIN pedido_item pi ON pi.pedido_id = p.id
            WHERE p.cliente_id = ?
            ORDER BY p.id DESC;
        `, [id])

        return resultado;
    }
}

export default PedidoRepository;