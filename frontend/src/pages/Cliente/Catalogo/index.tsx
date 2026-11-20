import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

import { listar } from "../../../services/produtoApi";
import { buscarUsuarioLogado } from "../../../services/usuarioApi";
import type { Produto, ItemCarrinho } from "../../../types/produto";
import { obterMensagemErro } from "../../../utils/obterMensagemErro";
import { swalAviso, toastSucesso } from "../../../utils/alertas";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import CardsProdutos from "../../../components/CardsProdutos";
import ModalProduto from "../../../components/Modais/ModalProduto";
import ModalCarrinho from "../../../components/Modais/ModalCarrinho";

import {
    ContainerPagina,
    Conteudo,
    SessaoBusca,
    ConteudoBusca,
    SessaoProdutos,
    BotaoCarrinho,
} from "./style";

// Lê o carrinho salvo no navegador e descarta itens antigos/estragados
// (versões anteriores salvavam produtos sem id, o que misturava os itens).
function carregarCarrinhoSalvo(): ItemCarrinho[] {
    try {
        const salvo = JSON.parse(localStorage.getItem("carrinho") ?? "[]");

        if (!Array.isArray(salvo)) return [];

        return salvo.filter((item) =>
            Number.isInteger(item?.produto?.id) && Number.isInteger(item?.quantidade) && item.quantidade > 0
        );
    } catch {
        return [];
    }
}

// Catálogo público: qualquer pessoa vê os produtos e monta o carrinho.
// O login só é pedido na hora de fazer o pedido.
function Catalogo() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState("");
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
    const [logado, setLogado] = useState(false);

    const [carrinho, setCarrinho] = useState<ItemCarrinho[]>(carregarCarrinhoSalvo);
    const [carrinhoAberto, setCarrinhoAberto] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
    }, [carrinho]);

    // Descobre se a pessoa está logada só para montar o menu certo
    useEffect(() => {
        if (!localStorage.getItem("token")) return;

        buscarUsuarioLogado()
            .then(() => setLogado(true))
            .catch(() => localStorage.removeItem("token"));
    }, []);

    useEffect(() => {
        listar()
            .then(setProdutos)
            .catch((error) => setErroCarregamento(
                obterMensagemErro(error, "Não foi possível carregar os produtos. Tente novamente em instantes.")
            ))
            .finally(() => setCarregando(false));
    }, []);

    const fecharModal = useCallback(() => setProdutoSelecionado(null), []);

    function handleLogout() {
        localStorage.removeItem("token");
        navigate('/login');
    }

    async function handleFazerPedido() {
        if (!logado) {
            setCarrinhoAberto(false);
            await swalAviso("Entre na sua conta (ou crie uma) para finalizar o pedido. Seu carrinho fica guardado.");
            navigate("/login");
            return;
        }

        // A finalização de verdade (gravar o pedido no banco) chega na Etapa 6.
        alert("Pedido feito com sucesso");

        setCarrinho([]);
        setCarrinhoAberto(false);
    }

    function adicionarNoCarrinho(produto: Produto, quantidade: number) {
        const itemExistente = carrinho.find((item) => item.produto.id === produto.id);
        const quantidadeAtual = itemExistente?.quantidade ?? 0;

        // Impede ultrapassar o estoque disponível
        const quantidadeAdicionar = Math.min(quantidade, produto.quantidade_estoque - quantidadeAtual);

        if (quantidadeAdicionar <= 0) {
            swalAviso(`Você já tem todo o estoque de "${produto.nome}" no carrinho (${quantidadeAtual}).`);
            return;
        }

        setCarrinho((carrinhoAtual) => {
            if (itemExistente) {
                return carrinhoAtual.map((item) =>
                    item.produto.id === produto.id
                        ? { ...item, quantidade: item.quantidade + quantidadeAdicionar }
                        : item
                );
            }

            return [...carrinhoAtual, { produto, quantidade: quantidadeAdicionar }];
        });

        toastSucesso(`${quantidadeAdicionar}x ${produto.nome} adicionado ao carrinho.`);
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

    // Diminui a quantidade de um produto (remove quando chega a zero)
    function diminuirQuantidade(id: number) {
        setCarrinho((carrinhoAtual) =>
            carrinhoAtual.flatMap((item) => {
                if (item.produto.id !== id) return [item];
                if (item.quantidade <= 1) return [];
                return [{ ...item, quantidade: item.quantidade - 1 }];
            })
        );
    }

    // Remove completamente um produto do carrinho
    function removerDoCarrinho(id: number) {
        setCarrinho((carrinhoAtual) =>
            carrinhoAtual.filter((item) => item.produto.id !== id)
        );
    }

    const linksNavegacao = logado
        ? [
            { id: 1, texto: "Catálogo", href: "/catalogo", ativo: true },
            { id: 2, texto: "Meus Pedidos", href: "/clientePedidos", ativo: false },
            { id: 3, texto: "Perfil", href: "/perfil", ativo: false },
            { id: 4, texto: "Sair", href: "/login", ativo: false, aoClicar: handleLogout },
        ]
        : [
            { id: 1, texto: "Catálogo", href: "/catalogo", ativo: true },
            { id: 2, texto: "Entrar", href: "/login", ativo: false },
            { id: 3, texto: "Criar Conta", href: "/cadastro", ativo: false },
        ];

    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);

    return (
        <ContainerPagina>
            <Navbar linkLogo={logado ? "/catalogo" : "/"} links={linksNavegacao} />

            {carrinho.length > 0 && (
                <BotaoCarrinho
                    type="button"
                    onClick={() => setCarrinhoAberto(true)}
                >
                    <FiShoppingCart />
                    Carrinho ({totalItens})
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
                    {carregando && <p>Carregando produtos...</p>}

                    {!carregando && erroCarregamento && <p>{erroCarregamento}</p>}

                    {!carregando && !erroCarregamento && produtos.length === 0 && (
                        <p>Nenhum produto disponível no momento.</p>
                    )}

                    <CardsProdutos
                        produtos={produtos}
                        aoSaberMais={setProdutoSelecionado}
                        aoAdicionar={adicionarNoCarrinho}
                    />

                    {produtoSelecionado && (
                        <ModalProduto
                            produto={produtoSelecionado}
                            aoFechar={fecharModal}
                        />
                    )}
                </SessaoProdutos>
            </Conteudo>

            <Footer linkLogo={logado ? "/catalogo" : "/"} />

            {carrinhoAberto && (
                <ModalCarrinho
                    itens={carrinho}
                    aoFechar={() => setCarrinhoAberto(false)}
                    aoFazerPedido={handleFazerPedido}
                    aoAumentar={aumentarQuantidade}
                    aoDiminuir={diminuirQuantidade}
                    aoRemover={removerDoCarrinho}
                />
            )}
        </ContainerPagina>
    );
}

export default Catalogo;
