import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaArrowLeft } from "react-icons/fa";

import TabelaGeral from "../../../components/TabelaGeral";
import Navbar from "../../../components/Navbar";
import BotaoGeral from "../../../components/BotaoGeral";

import {
    PaginaContainer,
    AbasContainer,
    Aba,
    PedidosCabecalho,
    PedidosConteudo
} from "./style";
import { Titulo } from "../../../components/TabelaGeral/style";


function PedidosCotacoes() {
    const [abaSelecionada, setAbaSelecionada] = useState<"pedidos" | "cotacoes">("pedidos");
    const [registroSelecionado, setRegistroSelecionado] = useState<any>(null);
    const [modalAberto, setModalAberto] = useState(false);


    // DADOS TEMPORAIS (MOCK)
    const pedidos = [
        {
            id: 1,
            produtos: [
                { id: 1, nome: "Palete PBR", quantidade: 10, preco_unitario: 45.00 },
                { id: 2, nome: "Palete descartável", quantidade: 5, preco_unitario: 25.00 }
            ],
            status: "pendente",
            previsao_busca: null
        },
        {
            id: 2,
            produtos: [
                { id: 3, nome: "Palete reforçado", quantidade: 8, preco_unitario: 75.00 },
                { id: 4, nome: "Palete plástico", quantidade: 3, preco_unitario: 120.00 }
            ],
            status: "respondido",
            previsao_busca: "21/11/2026"
        }
    ];


    const cotacoes = [
        {
            id: 1,
            produtos: [
                { id: 1, nome: "Palete PBR", quantidade: 20 },
                { id: 4, nome: "Palete plástico", quantidade: 10 }
            ],
            status: "pendente",
            validade: null
        },
        {
            id: 2,
            produtos: [
                { id: 3, nome: "Palete reforçado", quantidade: 15, preco_unitario: 70.00 },
                { id: 2, nome: "Palete descartável", quantidade: 30, preco_unitario: 23.00 }
            ],
            status: "respondida",
            validade: "23/11/2026"
        },
        {
            id: 3,
            produtos: [
                { id: 1, nome: "Palete PBR", quantidade: 50, preco_unitario: 43.00 },
                { id: 3, nome: "Palete reforçado", quantidade: 20, preco_unitario: 72.00 }
            ],
            status: "expirada",
            validade: "13/11/2026"
        }
    ];


    // COLUNAS
    const colunasPedidos = [
        {
            titulo: "Pedido",
            chave: "id",
            renderizar: (valor: number) => `#${valor}`
        },
        {
            titulo: "Produtos",
            chave: "produtos",
            renderizar: (valor: any[], pedido: any) => (
                <button onClick={() => abrirProdutos(pedido)}>
                    {valor.length} produtos
                </button>
            )
        },
        {
            titulo: "Status",
            chave: "status",
            renderizar: (valor: string) => (
                <span>{valor === "pendente" ? "Pendente" : "Respondido"}</span>
            )
        },
        {
            titulo: "Previsão de busca",
            chave: "previsao_busca",
            renderizar: (valor: string | null) => valor ?? "-"
        }
    ];

    const colunasCotacoes = [
        {
            titulo: "Cotação",
            chave: "id",
            renderizar: (valor: number) => `#${valor}`
        },
        {
            titulo: "Produtos",
            chave: "produtos",
            renderizar: (valor: any[], cotacao: any) => (
                <button onClick={() => abrirProdutos(cotacao)}>
                    {valor.length} produtos
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

                return <span>{status[valor as keyof typeof status]}</span>;
            }
        },
        {
            titulo: "Validade",
            chave: "validade",
            renderizar: (valor: string | null) => valor ?? "-"
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
                        titulo="Meus Pedidos"
                        colunas={colunasPedidos}
                        dados={pedidos}
                    />
                ) : (
                    <TabelaGeral
                        titulo="Minhas Cotações"
                        colunas={colunasCotacoes}
                        dados={cotacoes}
                    />
                )}
            </PedidosConteudo>

        </PaginaContainer>
    )
}

export default PedidosCotacoes;