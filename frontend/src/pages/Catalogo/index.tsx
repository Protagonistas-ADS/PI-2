import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ListaProdutos from "../../components/ListaProdutos";
import {
    ContainerPagina,
    Conteudo,
    SessaoBusca,
    ConteudoBusca,
    SessaoProdutos,
} from "./style";

interface Produto {
    readonly id: number;
    nome: string;
    imagem: string;
    descricao: string;
    preco: number;
    quantidadeEstoque: number;
}

const bancoProdutos: Produto[] = [
    {id: 1, nome: 'produto1', imagem: 'none', descricao: 'primeiro produto', preco: 15.44, quantidadeEstoque: 12},
    {id: 2, nome: 'produto2', imagem: 'none', descricao: 'segundo produto', preco: 20.44, quantidadeEstoque: 16},
    {id: 3, nome: 'produto3', imagem: 'none', descricao: 'terceiro produto', preco: 35.43, quantidadeEstoque: 92},
];

function Catalogo() {
    const [produtos, setProdutos] = useState<Produto[]>(bancoProdutos);
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

    const linksNavegacao = [
        { id: 1, texto: "Catálogo", href: "/catalogo", ativo: true },
        { id: 3, texto: "Home", href: "/", ativo: false },
        { id: 4, texto: "Contatos", href: "#contatos", ativo: false },
    ];

    function abrirModal(produto: Produto): void {
        setProdutoSelecionado(produto);
    }


    return (
        <ContainerPagina>
            <Navbar links={linksNavegacao} />

            <Conteudo>
                <SessaoBusca>
                    <ConteudoBusca>
                        <p>TODOS OS PRODUTOS</p>

                        <h2>Catálogo Completo</h2>

                        <p>Explore nossa linha completa de paletes de madeira</p>
                    </ConteudoBusca>
                </SessaoBusca>
                <SessaoProdutos>
                    <ListaProdutos 
                        produtos={produtos}
                        aoSaberMais={abrirModal}
                    />
                </SessaoProdutos>
            </Conteudo>

            <Footer />
        </ContainerPagina>
    )
}

export default Catalogo;