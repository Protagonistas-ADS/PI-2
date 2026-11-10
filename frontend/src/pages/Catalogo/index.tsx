import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CardsProdutos from "../../components/CardsProdutos";
import ModalProduto from "../../components/ModalProduto";
import {
    ContainerPagina,
    Conteudo,
    SessaoBusca,
    ConteudoBusca,
    SessaoProdutos,
} from "./style";
import ProdutoImagemExemplo from "../../assets/PaleteBackground.png";

interface Produto {
    readonly id: number;
    nome: string;
    imagem: string;
    descricao: string;
    preco: number;
    quantidadeEstoque: number;
}

// Banco para teste
const bancoProdutos: Produto[] = [
    {id: 1, nome: 'produto1', imagem: ProdutoImagemExemplo, descricao: 'primeiro produto', preco: 15.44, quantidadeEstoque: 0},
    {id: 2, nome: 'produto2', imagem: ProdutoImagemExemplo, descricao: 'segundo produto', preco: 20.44, quantidadeEstoque: 16},
    {id: 3, nome: 'produto3', imagem: ProdutoImagemExemplo, descricao: 'terceiro produto', preco: 35.43, quantidadeEstoque: 92},
];


function Catalogo() {
    const [produtos, setProdutos] = useState<Produto[]>(bancoProdutos);
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

    const linksNavegacao = [
        { id: 2, texto: "Pedidos/Cotações", href: "/catalogo", ativo: false },
        { id: 1, texto: "Perfil", href: "/catalogo", ativo: false },
        { id: 3, texto: "Contatos", href: "#contatos", ativo: false },
        { id: 4, texto: "Sair", href: "/login", ativo: false },
    ];

    function abrirModal(produto: Produto) {
        setProdutoSelecionado(produto);
    }

    function fecharModal() {
        setProdutoSelecionado(null);
    }


    return (
        <ContainerPagina>
            <Navbar linkLogo="/catalogo" links={linksNavegacao} />

            <Conteudo>
                <SessaoBusca>
                    <ConteudoBusca>
                        <p>TODOS OS PRODUTOS</p>

                        <h2>Catálogo Completo</h2>

                        <p>Explore nossa linha completa de paletes de madeira</p>
                    </ConteudoBusca>
                </SessaoBusca>

                <SessaoProdutos>
                    <CardsProdutos 
                        produtos={produtos}
                        aoSaberMais={abrirModal}
                    />

                    {produtoSelecionado && (
                        <ModalProduto 
                            produto={produtoSelecionado} 
                            aoFechar={fecharModal} 
                        />
                    )}
                </SessaoProdutos>
            </Conteudo>

            <Footer linkLogo="/catalogo" />
        </ContainerPagina>
    )
}

export default Catalogo;