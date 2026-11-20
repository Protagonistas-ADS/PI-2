import ProdutoRepository from "../repositories/produto.repository";
import { criarErro } from "../utils/criarErro";

// Os campos já chegam validados pelo Zod (ProdutoSchema), então aqui ficam só as regras de negócio.
const ProdutoService = {

    async Criar(nome: string, descricao: string, preco: number, quantidade: number, imagem: string | null = null) {
        return ProdutoRepository.Criar(nome, descricao, preco, quantidade, imagem);
    },

    // Catálogo público: só produtos ativos.
    async ListarAtivos() {
        return ProdutoRepository.Listar(true);
    },

    // Administrador: todos, inclusive os desativados.
    async ListarTodos() {
        return ProdutoRepository.Listar(false);
    },

    // Público: um produto desativado responde como "não encontrado".
    async Buscar(id: number) {
        const produto = await ProdutoRepository.Buscar(id, true);

        if (!produto) {
            throw criarErro("Produto não encontrado.", 404);
        }

        return produto;
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
