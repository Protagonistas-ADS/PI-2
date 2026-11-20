import db from "../configs/db";
import { RowDataPacket } from "mysql2";

// Consultas que montam os números do painel do administrador.

interface Contagem extends RowDataPacket {
    total: number;
}

export interface ProdutoEstoqueBaixo extends RowDataPacket {
    id: number;
    nome: string;
    quantidade_estoque: number;
}

interface TotaisVendas extends RowDataPacket {
    quantidade: number;
    valor_total: string | number;
}

const AdminRepository = {

    // Pedidos esperando a loja confirmar
    async ContarPendentes(): Promise<number> {
        const [resultado] = await db.execute<Contagem[]>(`
            SELECT COUNT(*) AS total
            FROM pedido
            WHERE status = 'pendente';
        `);

        return Number(resultado[0]?.total ?? 0);
    },

    // Pedidos que devem sair hoje: já separados (pronto para retirada)
    // ou confirmados com a retirada marcada para hoje
    async ContarRetirarHoje(): Promise<number> {
        const [resultado] = await db.execute<Contagem[]>(`
            SELECT COUNT(*) AS total
            FROM pedido
            WHERE status = 'pronto_retirada'
               OR (status = 'confirmado' AND DATE(previsao_busca) = CURDATE());
        `);

        return Number(resultado[0]?.total ?? 0);
    },

    // Produtos ativos com estoque no limite ou abaixo dele (o menor primeiro)
    async ListarEstoqueBaixo(limite: number): Promise<ProdutoEstoqueBaixo[]> {
        const [resultado] = await db.execute<ProdutoEstoqueBaixo[]>(`
            SELECT id, nome, quantidade_estoque
            FROM produto
            WHERE ativo = true
              AND quantidade_estoque <= ?
            ORDER BY quantidade_estoque ASC, nome ASC;
        `, [limite]);

        return resultado;
    },

    // Vendas (pedidos entregues) do mês atual
    async SomarVendasDoMes(): Promise<{ quantidade: number; valor_total: number }> {
        const [resultado] = await db.execute<TotaisVendas[]>(`
            SELECT COUNT(*) AS quantidade, COALESCE(SUM(valor_total), 0) AS valor_total
            FROM venda
            WHERE data_venda >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
              AND data_venda < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01');
        `);

        return {
            quantidade: Number(resultado[0]?.quantidade ?? 0),
            valor_total: Number(resultado[0]?.valor_total ?? 0)
        };
    }
};

export default AdminRepository;
