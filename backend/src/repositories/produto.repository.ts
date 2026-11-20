import db from "../configs/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface Produto {
    id: number;
    nome: string;
    descricao: string;
    preco_unitario: number;
    quantidade_estoque: number;
    imagem: string | null;
    ativo: boolean;
}

type LinhaProduto = Produto & RowDataPacket;

// O MySQL devolve DECIMAL como texto ("45.00") e BOOLEAN como 0/1.
// Aqui convertemos para número e true/false, para o frontend receber os tipos certos.
function formatarProduto(linha: LinhaProduto): Produto {
    return {
        id: linha.id,
        nome: linha.nome,
        descricao: linha.descricao,
        preco_unitario: Number(linha.preco_unitario),
        quantidade_estoque: linha.quantidade_estoque,
        imagem: linha.imagem,
        ativo: Boolean(linha.ativo)
    };
}

const CAMPOS = `id, nome, descricao, preco_unitario, quantidade_estoque, imagem, ativo`;

const ProdutoRepository = {

    async Criar(nome: string, descricao: string, preco: number, quantidade: number, imagem: string | null): Promise<number> {
        const [resultado] = await db.execute<ResultSetHeader>(`
            INSERT INTO produto (nome, descricao, preco_unitario, quantidade_estoque, imagem)
            VALUES (?, ?, ?, ?, ?);
        `, [nome, descricao, preco, quantidade, imagem]);

        return resultado.insertId;
    },

    // apenasAtivos = true: catálogo público. false: lista completa para o administrador.
    async Listar(apenasAtivos: boolean): Promise<Produto[]> {
        const [resultado] = await db.execute<LinhaProduto[]>(`
            SELECT ${CAMPOS}
            FROM produto
            ${apenasAtivos ? "WHERE ativo = 1" : ""}
            ORDER BY nome;
        `);

        return resultado.map(formatarProduto);
    },

    async Buscar(id: number, apenasAtivos: boolean): Promise<Produto | null> {
        const [resultado] = await db.execute<LinhaProduto[]>(`
            SELECT ${CAMPOS}
            FROM produto
            WHERE id = ? ${apenasAtivos ? "AND ativo = 1" : ""};
        `, [id]);

        const linha = resultado[0];

        return linha ? formatarProduto(linha) : null;
    },

    async Editar(id: number, nome: string, descricao: string, preco: number, quantidade: number, imagem: string | null): Promise<void> {
        await db.execute(`
            UPDATE produto
            SET nome = ?, descricao = ?, preco_unitario = ?, quantidade_estoque = ?, imagem = ?
            WHERE id = ?;
        `, [nome, descricao, preco, quantidade, imagem, id]);
    },

    // Em vez de apagar (o que quebraria pedidos e notas antigos), só liga/desliga o produto.
    async AlterarAtivo(id: number, ativo: boolean): Promise<void> {
        await db.execute(`
            UPDATE produto SET ativo = ? WHERE id = ?;
        `, [ativo, id]);
    }
};

export default ProdutoRepository;
