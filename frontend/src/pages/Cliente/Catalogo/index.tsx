import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

import { listar } from "../../../services/produtoApi";
import { buscarUsuarioLogado } from "../../../services/usuarioApi";
import type { Produto } from "../../../types/produto";
import { obterMensagemErro } from "../../../utils/obterMensagemErro";
import { useCarrinho } from "../../../hooks/useCarrinho";
import { sairDaConta } from "../../../utils/destinoAposLogin";
import type { PerfilUsuario } from "../../../types/usuario";

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

// Catálogo público: qualquer pessoa vê os produtos e monta o carrinho.
// O login só é pedido na hora de finalizar o pedido (página /carrinho).
function Catalogo() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState("");
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
    const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
    const logado = perfil !== null;

    const carrinho = useCarrinho();
    const [carrinhoAberto, setCarrinhoAberto] = useState(false);
    const navigate = useNavigate();

    // Descobre se a pessoa está logada só para montar o menu certo
    useEffect(() => {
        if (!localStorage.getItem("token")) return;

        buscarUsuarioLogado()
            .then((usuario) => setPerfil(usuario.perfil))
            .catch(() => sairDaConta());
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
        sairDaConta();
        navigate('/login');
    }

    const linksNavegacao = perfil === "administrador"
        ? [
            { id: 1, texto: "Catálogo", href: "/catalogo", ativo: true },
            { id: 2, texto: "Painel", href: "/admin", ativo: false },
            { id: 4, texto: "Sair", href: "/login", ativo: false, aoClicar: handleLogout },
        ]
        : logado
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

    return (
        <ContainerPagina>
            <Navbar linkLogo={logado ? "/catalogo" : "/"} links={linksNavegacao} />

            {carrinho.itens.length > 0 && (
                <BotaoCarrinho
                    type="button"
                    onClick={() => setCarrinhoAberto(true)}
                >
                    <FiShoppingCart />
                    Carrinho ({carrinho.totalItens})
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
                        aoAdicionar={carrinho.adicionar}
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
                    itens={carrinho.itens}
                    aoFechar={() => setCarrinhoAberto(false)}
                    textoAcao="Ir para o carrinho e finalizar"
                    aoAcao={() => navigate("/carrinho")}
                    aoAumentar={carrinho.aumentar}
                    aoDiminuir={carrinho.diminuir}
                    aoRemover={carrinho.remover}
                />
            )}
        </ContainerPagina>
    );
}

export default Catalogo;
