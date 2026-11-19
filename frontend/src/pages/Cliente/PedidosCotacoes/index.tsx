import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import {
    listarCotacoesCliente,
    listarItensCotacao,
    cancelarCotacao,
    marcarComoLida,
} from "../../../services/cotacaoApi";

import {
    listarPedidosCliente,
    listarItensPedido,
    cancelarPedido,
} from "../../../services/pedidoApi";

import { swalConfirmacao, swalErro, toastSucesso } from "../../../utils/alertas";

import TabelaGeral from "../../../components/TabelaGeral";
import Navbar from "../../../components/Navbar";
import BotaoGeral from "../../../components/BotaoGeral";
import ModalCarrinho from "../../../components/ModalCarrinho";

import {
    PaginaContainer,
    AbasContainer,
    Aba,
    PedidosCabecalho,
    PedidosConteudo
} from "./style";
import { obterMensagemErro } from "../../../utils/obterMensagemErro";




function PedidosCotacoes() {
    const [abaSelecionada, setAbaSelecionada] = useState<"pedidos" | "cotacoes">("pedidos");
    const [registroSelecionado, setRegistroSelecionado] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [cotacoes, setCotacoes] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [produtosPedido, setProdutosPedido] = useState([]);
    const [modalPedidoAberto, setModalPedidoAberto] = useState(false);
    const [produtosCotacao, setProdutosCotacao] = useState<any[]>([]);
    const [modalCotacaoAberto, setModalCotacaoAberto] = useState(false);

    const navigate = useNavigate();

    async function carregarCotacoesCliente() {
        try {
            const dados = await listarCotacoesCliente();
            setCotacoes(dados);
        } catch (error) {
            console.error("Erro ao carregar cotações: ", error);
        }
    }

    async function carregarPedidosCliente() {
        try {
            const dados = await listarPedidosCliente();
            setPedidos(dados);
        } catch (error) {
            console.error("Erro ao carregar pedidos: ", error);
        }
    }

    async function abrirProdutosPedido(id: number) {
        try {
            const produtos = await listarItensPedido(id);

            const itens = produtos.map((produto: any) => (
                {
                    produto: {
                        produtoId: produto.produtoId,
                        produtoNome: produto.produtoNome,
                        precoUnitario: Number(produto.preco_unitario)
                    },

                    quantidade: produto.quantidade
                }
            ));

            setProdutosPedido(itens);
            setModalPedidoAberto(true)
        } catch (error) {
            console.error("Erro ao abrir itens do pedido: ", error);
        }
    }

    async function abrirProdutosCotacao(id: number) {
        try {
            const resultado = await listarItensCotacao(id);

            const itens = resultado.produtos.map((produto: any) => (
                {
                    produto: {
                        produtoId: produto.produtoId,
                        produtoNome: produto.produtoNome,
                        precoUnitario: Number(produto.precoUnitario ?? 0)
                    },

                    quantidade: produto.quantidade
                }
            ));

            setProdutosCotacao(itens);
            setModalCotacaoAberto(true)
        } catch (error) {
            console.error("Erro ao abrir itens da cotação: ", error);
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
            console.error("Erro ao cancelar pedido:", error);
            swalErro("Não foi possível cancelar o pedido.");
        }
    }

    async function handleCancelarCotacao(id: number) {
        const confirmacao = await swalConfirmacao(
            "Tem certeza que deseja cancelar esta Cotação?"
        );

        if (!confirmacao.isConfirmed) return;

        try {
            await cancelarCotacao(id);

            setCotacoes((cotacoesAtuais) =>
                cotacoesAtuais.filter((cotacao: any) => cotacao.id !== id)
            );

            toastSucesso("Cotação cancelada com sucesso.");
        } catch (error) {
            console.error("Erro ao cancelar pedido:", error);
            swalErro("Não foi possível cancelar a cotação.");
        }
    }


    async function handleMarcarComoLida(id: number) {
        const confirmacao = await swalConfirmacao(`
            O perídodo de resposta desta cotação expirou.
            Marcar como lida mostra que está ciente disso.
            Ainda é possível propor uma nova cotação.
        `);

        if (!confirmacao.isConfirmed) return;


        try {
            await marcarComoLida(id);

            setCotacoes((cotacoesAtuais) =>
                cotacoesAtuais.filter((cotacao: any) => cotacao.id !== id)
            );

            toastSucesso("Cotação marcada como lida.");
        } catch (error) {
            swalErro(obterMensagemErro(error, "Não foi possível marcar cotação como lida"));
        }
    }

    function handleLogout() {
        localStorage.removeItem("token");
        navigate('/login');
    }

    function handleResponderCotacao(id: number) {
        alert("Vou fazer ainda");
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
            renderizar: (valorCelula: string, registro: any) => (
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

    const colunasCotacoes = [
        {
            titulo: "Cotação",
            chave: "id"
        },
        {
            titulo: "Quantidade",
            chave: "quantidade_total",
            renderizar: (valorCelula: number, registro: any) => (
                <button
                    className="botao-quantidade"
                    type="button"
                    onClick={() => abrirProdutosCotacao(registro.id)}
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
                    respondida: "Respondida",
                    expirada: "Expirada"
                };

                return (
                    <span className={`status status-${valorCelula}`}>
                        {status[valorCelula as keyof typeof status] ?? valorCelula}
                    </span>
                );
            }
        },
        {
            titulo: "Validade",
            chave: "validade",
            renderizar: (valorCelula: string | null) => {
                if (!valorCelula) return "Aguardando resposta";

                const data = String(valorCelula).replace("T", " ").slice(0, 16);
                const [ano, mes, diaHora] = data.split("-");
                const [dia, hora] = diaHora!.split(" ");

                return `${dia}/${mes}/${ano}`;
            }
        },
        {
            titulo: "Ações",
            chave: "id",
            renderizar: (valorCelula: string, registro: any) => {
                if (registro.status === "expirada") {
                    return (
                        <button
                            type="button"
                            className="acao-marcar-lida"
                            onClick={() => handleMarcarComoLida(registro.id)}
                        >
                            Marcar como Lida
                        </button>
                    );
                }

                if (registro.status === "respondida") {
                    return (
                        <button
                            type="button"
                            className="acao-responder"
                            onClick={() => handleResponderCotacao(registro.id)}
                        >
                            Responder cotação
                        </button>
                    );
                }

                return (
                    <button
                        type="button"
                        className="acao-cancelar"
                        onClick={() => handleCancelarCotacao(registro.id)}
                    >
                        Cancelar
                    </button>
                );

            }
        }
    ];

    useEffect(() => {
        carregarCotacoesCliente();
        carregarPedidosCliente();
    }, []);

    const linksNavegacao = [
        { id: 3, texto: "Catálogo", href: "/catalogo", ativo: false },
        { id: 2, texto: "Pedidos/Cotações", href: "/clientePedidos", ativo: false },
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
                    <h1>Minhas Solicitações</h1>
                </PedidosCabecalho>
                <p style={{ fontSize: "1.2rem", color: "gray" }}>Acompanhe seus pedidos e cotações.</p>

                <AbasContainer>
                    <Aba
                        $ativa={abaSelecionada === "pedidos"}
                        onClick={() => setAbaSelecionada("pedidos")}
                    >
                        Pedidos
                    </Aba>
                    <Aba
                        $ativa={abaSelecionada === "cotacoes"}
                        onClick={() => setAbaSelecionada("cotacoes")}
                    >
                        Cotações
                    </Aba>
                </AbasContainer>

                {abaSelecionada === "pedidos" ? (
                    <TabelaGeral
                        titulo={`Meus Pedidos - ${pedidos.length} Registros`}
                        colunas={colunasPedidos}
                        dados={pedidos}
                    />
                ) : (
                    <TabelaGeral
                        titulo={`Minhas Cotações - ${cotacoes.length} Registros`}
                        colunas={colunasCotacoes}
                        dados={cotacoes}
                    />
                )}
            </PedidosConteudo>

            {modalPedidoAberto && (
                <ModalCarrinho
                    itens={produtosPedido}
                    aoFechar={() => setModalPedidoAberto(false)}
                    titulo="Produtos do Pedido"
                />
            )}

            {modalCotacaoAberto && (
                <ModalCarrinho
                    itens={produtosCotacao}
                    aoFechar={() => setModalCotacaoAberto(false)}
                    titulo="Produtos da Cotação"
                />
            )}

        </PaginaContainer>
    )
}

export default PedidosCotacoes;