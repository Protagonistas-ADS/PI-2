import ProdutoRepository, { Produto } from "../repositories/produto.repository";
import { criarErro } from "../utils/criarErro";

// O que o catálogo público pode ver: a quantidade em estoque é informação só do administrador.
// O cliente recebe apenas se o produto está disponível (estoque > 0) ou esgotado.
export type ProdutoPublico = Omit<Produto, "quantidade_estoque"> & { disponivel: boolean };

function paraPublico({ quantidade_estoque, ...produto }: Produto): ProdutoPublico {
    return { ...produto, disponivel: quantidade_estoque > 0 };
}

// Os campos já chegam validados pelo Zod (ProdutoSchema), então aqui ficam só as regras de negócio.
const ProdutoService = {

    async Criar(nome: string, descricao: string, preco: number, quantidade: number, imagem: string | null = null) {
        return ProdutoRepository.Criar(nome, descricao, preco, quantidade, imagem);
    },

    // Catálogo público: só produtos ativos, sem a quantidade em estoque.
    async ListarAtivos(): Promise<ProdutoPublico[]> {
        const produtos = await ProdutoRepository.Listar(true);

        return produtos.map(paraPublico);
    },

    // Administrador: todos, inclusive os desativados.
    async ListarTodos() {
        return ProdutoRepository.Listar(false);
    },

    // Público: um produto desativado responde como "não encontrado". Sem a quantidade em estoque.
    async Buscar(id: number): Promise<ProdutoPublico> {
        const produto = await ProdutoRepository.Buscar(id, true);

        if (!produto) {
            throw criarErro("Produto não encontrado.", 404);
        }

        return paraPublico(produto);
    },

    async Editar(id: number, nome: string, descricao: string, preco: number, quantidade: number, imagem: string | null = null) {
        await ProdutoService.GarantirExistencia(id);

        await ProdutoRepository.Editar(id, nome, descricao, preco, quantidade, imagem);
    },

    async AlterarAtivo(id: number, ativo: boolean) {
        await ProdutoService.GarantirExistencia(id);

        await ProdutoRepository.AlterarAtivo(id, ativo);
    },

    async GarantirExistencia(id: number) {
        const produto = await ProdutoRepository.Buscar(id, false);

        if (!produto) {
            throw criarErro("Produto não encontrado.", 404);
        }
    }
};

export default ProdutoService;
