import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import CardsProdutos from "../../../components/CardsProdutos";
import ModalProduto from "../../../components/ModalProduto";
import ModalCarrinho from "../../../components/ModalCarrinho";

import {
    ContainerPagina,
    Conteudo,
    SessaoBusca,
    ConteudoBusca,
    SessaoProdutos,
    BotaoCarrinho,
} from "./style";
import ProdutoImagemExemplo from "../../../assets/PaleteBackground.png";


interface Produto {
    readonly id: number;
    nome: string;
    imagem: string;
    descricao: string;
    preco: number;
    quantidadeEstoque: number;
}

interface ItemCarrinho {
    produto: Produto;
    quantidade: number;
}

// Banco para teste apagar depois
const bancoProdutos: Produto[] = [
    { id: 1, nome: 'produto1', imagem: ProdutoImagemExemplo, descricao: 'primeiro produto', preco: 15.44, quantidadeEstoque: 92 },
    { id: 2, nome: 'produto2', imagem: ProdutoImagemExemplo, descricao: 'segundo produto', preco: 20.44, quantidadeEstoque: 16 },
    { id: 3, nome: 'produto3', imagem: ProdutoImagemExemplo, descricao: 'terceiro produto', preco: 35.43, quantidadeEstoque: 92 },
];


function Catalogo() {
    const [produtos, setProdutos] = useState<Produto[]>(bancoProdutos);
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
    const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
    const [carrinhoAberto, setCarrinhoAberto] = useState(false);

    const navigate = useNavigate();

    function abrirModal(produto: Produto) {
        setProdutoSelecionado(produto);
    }

    function fecharModal() {
        setProdutoSelecionado(null);
    }

    function handleLogout() {
        localStorage.removeItem("token");
        navigate('/login');
    }

    function handleFazerPedido() {
        alert("Pedido feito com sucesso");
    }

    function handleFazerCotacao() {
        alert("Cotação feita com sucesso");
    }

    function adicionarNoCarrinho(produto: Produto, quantidade: number) {
        setCarrinho((carrinhoAtual) => {
            const itemExistente = carrinhoAtual.find((item) => item.produto.id === produto.id);

            if (itemExistente) {
                return carrinhoAtual.map((item) => item.produto.id === produto.id
                    ? { ...itemExistente, quantidade: item.quantidade + quantidade }
                    : item
                );
            }

            return [...carrinhoAtual, { produto, quantidade }];
        });
    }

    const linksNavegacao = [
        { id: 2, texto: "Pedidos/Cotações", href: "/catalogo", ativo: false },
        { id: 1, texto: "Perfil", href: "/perfil", ativo: false },
        { id: 3, texto: "Contatos", href: "#contatos", ativo: false },
        { id: 4, texto: "Sair", href: "/login", ativo: false, aoClicar: handleLogout },
    ];


    return (
        <ContainerPagina>
            <Navbar linkLogo="/catalogo" links={linksNavegacao} />

            {carrinho.length > 0 && (
                <BotaoCarrinho
                    type="button"
                    onClick={() => setCarrinhoAberto(true)}
                >
                    <FiShoppingCart />
                    Carrinho ({carrinho.reduce(
                        (total, item) => total + item.quantidade, 0
                    )})
                </BotaoCarrinho>
            )}

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
                            aoAdicionar={adicionarNoCarrinho}
                        />
                    )}
                </SessaoProdutos>
            </Conteudo>

            <Footer linkLogo="/catalogo" />

            {carrinhoAberto && (

                <ModalCarrinho
                    itens={carrinho}
                    aoFechar={() => setCarrinhoAberto(false)}
                    aoFazerPedido={handleFazerPedido}
                    aoFazerCotacao={handleFazerCotacao}
                />
            )}

        </ContainerPagina>


    )
}

export default Catalogo;