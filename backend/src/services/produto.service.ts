import ProdutoRepository from "../repositories/produto.repository";
import { criarErro } from "../utils/criarErro";

const ProdutoService = {
    
    async Criar(nome: string, descricao: string, preco: number, quantidade: number) {
        if (!nome || !descricao || !preco || !quantidade) {
            throw criarErro("Preencha todos os campos obrigatórios.", 400);
        }

        await ProdutoRepository.Criar(nome, descricao, preco, quantidade);
    },

   async Listar() {
        await ProdutoRepository.Listar();
   }
}

export default ProdutoService;
