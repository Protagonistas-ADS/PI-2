
import ProdutoRepository from "../repositories/produto.repository";
import { criarErro } from "../utils/criarErro";

const ProdutoService = {

    async Criar(
        nome: string,
        descricao: string,
        preco: number,
        quantidade: number,
        imagem: string | null = null
    ) {
        if (!nome || !descricao || !preco || !quantidade) {
            throw criarErro("Preencha todos os campos obrigatórios.", 400);
        }

        await ProdutoRepository.Criar(
            nome,
            descricao,
            preco,
            quantidade,
            imagem
        );
    },

    async Listar() {
        return ProdutoRepository.Listar();
    },

    async Buscar(id: number) {
        if (!id) {
            throw criarErro("ID do produto não fornecido.", 400);
        }

        return ProdutoRepository.Buscar(id);
    },

    async Deletar(id: number) {
        if (!id) {
            throw criarErro("ID do produto não fornecido.", 400);
        }

        return ProdutoRepository.Deletar(id);
    },

    async Editar(id: number, nome: string, descricao: string, preco: number, quantidade: number, imagem: string) {
        if (!id || !nome || !descricao || !preco || !quantidade || !imagem) {
            throw criarErro("Preencha todos os campos obrigatórios.", 400);
        }

        return ProdutoRepository.Editar(id, nome, descricao, preco, quantidade, imagem);
    }
};

export default ProdutoService;
