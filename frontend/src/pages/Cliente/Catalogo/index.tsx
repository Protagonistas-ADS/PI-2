import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

import { listar } from "../../../services/produtoApi";

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
    descricao: string;
    preco_unitario: number;
    quantidade_estoque: number;
    imagem: string;
}

interface ItemCarrinho {
    produto: Produto;
    quantidade: number;
}


function Catalogo() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

    const [carrinho, setCarrinho] = useState<ItemCarrinho[]>(() => {
        const carrinhoSalvo = localStorage.getItem("carrinho");

        return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];

    });

    useEffect(() => {
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
    }, [carrinho]);

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

        setCarrinho([]);
        setCarrinhoAberto(false);
    }

    function handleFazerCotacao() {
        alert("Cotação feita com sucesso");

        setCarrinho([]);
        setCarrinhoAberto(false);
    }

    function adicionarNoCarrinho(produto: Produto, quantidade: number) {
        setCarrinho((carrinhoAtual) => {
            const itemExistente = carrinhoAtual.find(
                (item) => item.produto.id === produto.id
            );

            const quantidadeAtual = itemExistente?.quantidade ?? 0;

            // Impede ultrapassar o estoque disponível
            const quantidadeAdicionar = Math.min(
                quantidade,
                produto.quantidade_estoque - quantidadeAtual
            );

            if (quantidadeAdicionar <= 0) {
                return carrinhoAtual;
            }

            if (itemExistente) {
                return carrinhoAtual.map((item) =>
                    item.produto.id === produto.id
                        ? {
                            ...item,
                            quantidade: item.quantidade + quantidadeAdicionar
                        }
                        : item
                );
            }

            return [
                ...carrinhoAtual,
                { produto, quantidade: quantidadeAdicionar }
            ];
        });
    }

    // Aumenta a quantidade de um produto
    function aumentarQuantidade(id: number) {
        setCarrinho((carrinhoAtual) =>
            carrinhoAtual.map((item) =>
                item.produto.id === id &&
                    item.quantidade < item.produto.quantidade_estoque
                    ? { ...item, quantidade: item.quantidade + 1 }
                    : item
            )
        );
    }

    // Diminui a quantidade de um produto
    function diminuirQuantidade(id: number) {
        setCarrinho((carrinhoAtual) =>
            carrinhoAtual.flatMap((item) => {
                if (item.produto.id !== id) {
                    return [item];
                }

                // Remove o produto quando chegar a zero
                if (item.quantidade <= 1) {
                    return [];
                }

                return [
                    { ...item, quantidade: item.quantidade - 1 }
                ];
            })
        );
    }

    // Remove completamente um produto do carrinho
    function removerDoCarrinho(id: number) {
        setCarrinho((carrinhoAtual) =>
            carrinhoAtual.filter((item) => item.produto.id !== id)
        );
    }

    async function carregarProdutos() {
        const resposta = await listar();

        const produtosFormatados = resposta.map((produto: Produto) => ({
            ...produto,
            imagem: `${import.meta.env.VITE_API_URL}/uploads/${produto.imagem.replace(/^\/+/, "")}`
        }));
        setProdutos(produtosFormatados);
    }

    const linksNavegacao = [
        { id: 3, texto: "Catálogo", href: "/catalogo", ativo: false },
        { id: 2, texto: "Pedidos/Cotações", href: "/clientePedidos", ativo: false },
        { id: 1, texto: "Perfil", href: "/perfil", ativo: false },
        { id: 4, texto: "Sair", href: "/login", ativo: false, aoClicar: handleLogout },
    ];

    useEffect(() => {
        carregarProdutos();
    }, []);

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
                    aoAumentar={aumentarQuantidade}
                    aoDiminuir={diminuirQuantidade}
                    aoRemover={removerDoCarrinho}
                />
            )}

        </ContainerPagina>


    )

}

export default Catalogo;