import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import { listarCotacoesCliente, listarItensCotacao } from "../../../services/cotacaoApi";
import { listarPedidosCliente, listarItensPedido } from "../../../services/pedidoApi";

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
                        id: produto.produto_id,
                        nome: produto.produto_nome,
                        preco: Number(produto.preco_unitario)
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
                        id: produto.produto_id,
                        nome: produto.produto_nome,
                        preco: Number(produto.preco_unitario ?? 0)
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

    // COLUNAS
    const colunasPedidos = [
        {
            titulo: "Pedido",
            chave: "id"
        },
        {
            titulo: "Quantidade",
            chave: "quantidade_total",
            renderizar: (valor: number, registro: any) => (
                <button
                    className="botao-quantidade"
                    type="button"
                    onClick={() => abrirProdutosPedido(registro.id)}
                >
                    {valor} unidades
                </button>
            )
        },
        {
            titulo: "Status",
            chave: "status",
            renderizar: (valor: string) => {
                const status = {
                    pendente: "Pendente",
                    respondido: "Respondido"
                };

                return (
                    <span className={`status status-${valor}`}>
                        {status[valor as keyof typeof status] ?? valor}
                    </span>
                );
            }
        },
        {
            titulo: "Previsão de busca",
            chave: "previsao_busca",
            renderizar: (valor: string | null) => {
                if (!valor) return "Aguardando definição";

                const data = String(valor).slice(0, 10);
                const [ano, mes, dia] = data.split("-");

                return `${dia}/${mes}/${ano}`;
            }
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
            renderizar: (valor: number, registro: any) => (
                <button
                    className="botao-quantidade"
                    type="button"
                    onClick={() => abrirProdutosCotacao(registro.id)}
                >
                    {valor} unidades
                </button>
            )
        },
        {
            titulo: "Status",
            chave: "status",
            renderizar: (valor: string) => {
                const status = {
                    pendente: "Pendente",
                    respondida: "Respondida",
                    expirada: "Expirada"
                };

                return (
                    <span className={`status status-${valor}`}>
                        {status[valor as keyof typeof status] ?? valor}
                    </span>
                );
            }
        },
        {
            titulo: "Validade",
            chave: "validade",
            renderizar: (valor: string | null) => {
                if (!valor) return "Aguardando resposta";

                const data = String(valor).replace("T", " ").slice(0, 16);
                const [ano, mes, diaHora] = data.split("-");
                const [dia, hora] = diaHora!.split(" ");

                return `${dia}/${mes}/${ano}`;
            }
        }
    ];


    function abrirProdutos(registro: any) {
        setRegistroSelecionado(registro);
        setModalAberto(true);
    }

    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate('/login');
    }

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