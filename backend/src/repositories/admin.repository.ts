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

// Usuário na tabela do painel (a senha nunca sai do banco)
export interface UsuarioListado extends RowDataPacket {
    id: number;
    nome: string;
    email: string;
    perfil: "cliente" | "administrador";
    criado_em: Date;
    total_pedidos: number;
    total_comprado: string | number;
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

    // Vendas (pedidos entregues) do mês atual.
    // O valor vem dos itens do pedido (quantidade x preço), porque a venda não guarda o total.
    async SomarVendasDoMes(): Promise<{ quantidade: number; valor_total: number }> {
        const [resultado] = await db.execute<TotaisVendas[]>(`
            SELECT
                COUNT(DISTINCT v.id) AS quantidade,
                COALESCE(SUM(pi.quantidade * pi.preco_unitario), 0) AS valor_total
            FROM venda v
            INNER JOIN pedido_item pi ON pi.pedido_id = v.pedido_id
            WHERE v.data_venda >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
              AND v.data_venda < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01');
        `);

        return {
            quantidade: Number(resultado[0]?.quantidade ?? 0),
            valor_total: Number(resultado[0]?.valor_total ?? 0)
        };
    },

    // Todos os usuários, sem a senha, com quantos pedidos fizeram e quanto já compraram
    // (soma das vendas = pedidos entregues). Subconsultas evitam somar linhas repetidas.
    async ListarUsuarios(): Promise<UsuarioListado[]> {
        const [resultado] = await db.execute<UsuarioListado[]>(`
            SELECT
                u.id,
                u.nome,
                u.email,
                u.perfil,
                u.criado_em,
                (SELECT COUNT(*) FROM pedido p WHERE p.cliente_id = u.id) AS total_pedidos,
                (
                    SELECT COALESCE(SUM(pi.quantidade * pi.preco_unitario), 0)
                    FROM venda v
                    INNER JOIN pedido p ON p.id = v.pedido_id
                    INNER JOIN pedido_item pi ON pi.pedido_id = v.pedido_id
                    WHERE p.cliente_id = u.id
                ) AS total_comprado
            FROM usuario u
            ORDER BY u.criado_em DESC, u.id DESC;
        `);

        return resultado;
    }
};

export default AdminRepository;
