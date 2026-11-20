import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import {
    listarPedidosCliente,
    listarItensPedido,
    cancelarPedido,
} from "../../../services/pedidoApi";

import { swalConfirmacao, swalErro, toastSucesso } from "../../../utils/alertas";
import { obterMensagemErro } from "../../../utils/obterMensagemErro";

import TabelaGeral from "../../../components/TabelaGeral";
import Navbar from "../../../components/Navbar";
import BotaoGeral from "../../../components/BotaoGeral";
import ModalCarrinho from "../../../components/Modais/ModalCarrinho";

import {
    PaginaContainer,
    PedidosCabecalho,
    PedidosConteudo
} from "./style";


function MeusPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [produtosPedido, setProdutosPedido] = useState([]);
    const [modalPedidoAberto, setModalPedidoAberto] = useState(false);

    const navigate = useNavigate();

    async function carregarPedidosCliente() {
        try {
            const dados = await listarPedidosCliente();
            setPedidos(dados);
        } catch (error) {
            swalErro(obterMensagemErro(error, "Não foi possível carregar seus pedidos."));
        }
    }

    async function abrirProdutosPedido(id: number) {
        try {
            const produtos = await listarItensPedido(id);

            // O backend devolve produto_id e produto_nome; o ModalCarrinho espera id e nome
            const itens = produtos.map((produto: any) => (
                {
                    produto: {
                        id: produto.produto_id,
                        nome: produto.produto_nome,
                        preco_unitario: Number(produto.preco_unitario)
                    },

                    quantidade: produto.quantidade
                }
            ));

            setProdutosPedido(itens);
            setModalPedidoAberto(true);
        } catch (error) {
            swalErro(obterMensagemErro(error, "Não foi possível abrir os itens do pedido."));
        }
    }

    async function handleCancelarPedido(id: number) {
        const confirmacao = await swalConfirmacao(
            "Tem certeza que deseja cancelar este pedido?"
        );

        if (!confirmacao.isConfirmed) return;

        try {
            await cancelarPedido(id);

            setPedidos((pedidosAtuais) =>
                pedidosAtuais.filter((pedido: any) => pedido.id !== id)
            );

            toastSucesso("Pedido cancelado com sucesso.");
        } catch (error) {
            swalErro(obterMensagemErro(error, "Não foi possível cancelar o pedido."));
        }
    }

    function handleLogout() {
        localStorage.removeItem("token");
        navigate('/login');
    }

    // COLUNAS
    const colunasPedidos = [
        {
            titulo: "Pedido",
            chave: "id"
        },
        {
            titulo: "Quantidade",
            chave: "quantidade_total",
            renderizar: (valorCelula: number, registro: any) => (
                <button
                    className="botao-quantidade"
                    type="button"
                    onClick={() => abrirProdutosPedido(registro.id)}
                >
                    {valorCelula} unidades
                </button>
            )
        },
        {
            titulo: "Status",
            chave: "status",
            renderizar: (valorCelula: string) => {
                const status = {
                    pendente: "Pendente",
                    respondido: "Respondido"
                };

                return (
                    <span className={`status status-${valorCelula}`}>
                        {status[valorCelula as keyof typeof status] ?? valorCelula}
                    </span>
                );
            }
        },
        {
            titulo: "Previsão de busca",
            chave: "previsao_busca",
            renderizar: (valorCelula: string | null) => {
                if (!valorCelula) return "Aguardando definição";

                const data = String(valorCelula).slice(0, 10);
                const [ano, mes, dia] = data.split("-");

                return `${dia}/${mes}/${ano}`;
            }
        },
        {
            titulo: "Ações",
            chave: "id",
            renderizar: (_valorCelula: string, registro: any) => (
                <button
                    type="button"
                    className="acao-cancelar"
                    onClick={() => handleCancelarPedido(registro.id)}
                >
                    Cancelar
                </button>
            )
        }
    ];

    useEffect(() => {
        carregarPedidosCliente();
    }, []);

    const linksNavegacao = [
        { id: 3, texto: "Catálogo", href: "/catalogo", ativo: false },
        { id: 2, texto: "Meus Pedidos", href: "/clientePedidos", ativo: false },
        { id: 1, texto: "Perfil", href: "/perfil", ativo: false },
        { id: 4, texto: "Sair", href: "/login", ativo: false, aoClicar: handleLogout },
    ];

    return (
        <PaginaContainer>
            <Navbar
                linkLogo="/clientePedidos"
                links={linksNavegacao}
            />

            <PedidosConteudo>

                <PedidosCabecalho>
                    <BotaoGeral
                        texto="Voltar"
                        destino="/catalogo"
                        icone={<FaArrowLeft />}
                    />
                    <h1>Meus Pedidos</h1>
                </PedidosCabecalho>
                <p style={{ fontSize: "1.2rem", color: "gray", marginBottom: "24px" }}>
                    Acompanhe o andamento dos seus pedidos.
                </p>

                <TabelaGeral
                    titulo={`Meus Pedidos - ${pedidos.length} Registros`}
                    colunas={colunasPedidos}
                    dados={pedidos}
                />
            </PedidosConteudo>

            {modalPedidoAberto && (
                <ModalCarrinho
                    itens={produtosPedido}
                    aoFechar={() => setModalPedidoAberto(false)}
                    titulo="Produtos do Pedido"
                />
            )}

        </PaginaContainer>
    )
}

export default MeusPedidos;
