import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import {
    listarPedidosCliente,
    listarItensPedido,
    cancelarPedido,
} from "../../../services/pedidoApi";
import { NOME_STATUS_PEDIDO, type Pedido } from "../../../types/pedido";

import { swalConfirmacao, swalErro, toastSucesso } from "../../../utils/alertas";
import { obterMensagemErro } from "../../../utils/obterMensagemErro";
import { formatarPreco } from "../../../utils/produto";
import { sairDaConta } from "../../../utils/destinoAposLogin";

import TabelaGeral from "../../../components/TabelaGeral";
import Navbar from "../../../components/Navbar";
import BotaoGeral from "../../../components/BotaoGeral";
import ModalCarrinho from "../../../components/Modais/ModalCarrinho";

import {
    PaginaContainer,
    PedidosCabecalho,
    PedidosConteudo
} from "./style";

// "2026-11-21T03:00:00.000Z" -> "21/11/2026" (no horário do navegador)
function formatarData(valor: string | null) {
    if (!valor) return null;
    return new Date(valor).toLocaleDateString("pt-BR");
}

interface ItemJanela {
    produto: { id: number; nome: string; preco_unitario: number };
    quantidade: number;
}

function MeusPedidos() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState("");
    const [pedidoAberto, setPedidoAberto] = useState<{ id: number; itens: ItemJanela[] } | null>(null);

    const navigate = useNavigate();

    async function carregarPedidosCliente() {
        try {
            setPedidos(await listarPedidosCliente());
        } catch (error) {
            setErroCarregamento(obterMensagemErro(error, "Não foi possível carregar seus pedidos."));
        } finally {
            setCarregando(false);
        }
    }

    async function abrirProdutosPedido(id: number) {
        try {
            const produtos = await listarItensPedido(id);

            // A janela espera { produto: { id, nome, preco_unitario }, quantidade }
            const itens = produtos.map((produto) => ({
                produto: {
                    id: produto.produto_id,
                    nome: produto.produto_nome,
                    preco_unitario: produto.preco_unitario
                },
                quantidade: produto.quantidade
            }));

            setPedidoAberto({ id, itens });
        } catch (error) {
            swalErro(obterMensagemErro(error, "Não foi possível abrir os itens do pedido."));
        }
    }

    async function handleCancelarPedido(id: number) {
        const confirmacao = await swalConfirmacao(
            `Tem certeza que deseja cancelar o pedido nº ${id}?`
        );

        if (!confirmacao.isConfirmed) return;

        try {
            await cancelarPedido(id);

            // O pedido continua na lista (histórico), agora como cancelado
            setPedidos((atuais) =>
                atuais.map((pedido) => pedido.id === id ? { ...pedido, status: "cancelado" } : pedido)
            );

            toastSucesso("Pedido cancelado com sucesso.");
        } catch (error) {
            swalErro(obterMensagemErro(error, "Não foi possível cancelar o pedido."));
            carregarPedidosCliente();
        }
    }

    function handleLogout() {
        sairDaConta();
        navigate('/login');
    }

    const colunasPedidos = [
        {
            titulo: "Pedido",
            chave: "id",
            renderizar: (valorCelula: number) => `nº ${valorCelula}`
        },
        {
            titulo: "Feito em",
            chave: "criado_em",
            renderizar: (valorCelula: string) => formatarData(valorCelula)
        },
        {
            titulo: "Itens",
            chave: "quantidade_total",
            renderizar: (valorCelula: number, registro: Pedido) => (
                <button
                    className="botao-quantidade"
                    type="button"
                    onClick={() => abrirProdutosPedido(registro.id)}
                >
                    {valorCelula} {valorCelula === 1 ? "unidade" : "unidades"}
                </button>
            )
        },
        {
            titulo: "Total",
            chave: "valor_total",
            renderizar: (valorCelula: number) => formatarPreco(valorCelula)
        },
        {
            titulo: "Status",
            chave: "status",
            renderizar: (valorCelula: Pedido["status"]) => (
                <span className={`status status-${valorCelula}`}>
                    {NOME_STATUS_PEDIDO[valorCelula] ?? valorCelula}
                </span>
            )
        },
        {
            titulo: "Retirada prevista",
            chave: "previsao_busca",
            renderizar: (valorCelula: string | null) => formatarData(valorCelula) ?? "A combinar"
        },
        {
            titulo: "Ações",
            chave: "acoes",
            // Só dá para cancelar pelo site enquanto a loja não confirmou
            renderizar: (_valorCelula: unknown, registro: Pedido) => registro.status === "pendente" ? (
                <button
                    type="button"
                    className="acao-cancelar"
                    onClick={() => handleCancelarPedido(registro.id)}
                >
                    Cancelar
                </button>
            ) : "—"
        }
    ];

    useEffect(() => {
        carregarPedidosCliente();
    }, []);

    const linksNavegacao = [
        { id: 1, texto: "Catálogo", href: "/catalogo", ativo: false },
        { id: 2, texto: "Meus Pedidos", href: "/clientePedidos", ativo: true },
        { id: 3, texto: "Perfil", href: "/perfil", ativo: false },
        { id: 4, texto: "Sair", href: "/login", ativo: false, aoClicar: handleLogout },
    ];

    return (
        <PaginaContainer>
            <Navbar
                linkLogo="/catalogo"
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
                <p className="subtitulo">
                    Acompanhe o andamento: aguardando confirmação → confirmado → pronto para retirada → entregue.
                </p>

                {carregando && <p className="mensagem">Carregando seus pedidos...</p>}

                {!carregando && erroCarregamento && <p className="mensagem">{erroCarregamento}</p>}

                {!carregando && !erroCarregamento && pedidos.length === 0 && (
                    <div className="mensagem">
                        <p>Você ainda não fez nenhum pedido.</p>
                        <Link to="/catalogo">Ver catálogo</Link>
                    </div>
                )}

                {!carregando && !erroCarregamento && pedidos.length > 0 && (
                    <TabelaGeral
                        titulo={`Meus Pedidos - ${pedidos.length} ${pedidos.length === 1 ? "registro" : "registros"}`}
                        colunas={colunasPedidos}
                        dados={pedidos}
                    />
                )}
            </PedidosConteudo>

            {pedidoAberto && (
                <ModalCarrinho
                    itens={pedidoAberto.itens}
                    aoFechar={() => setPedidoAberto(null)}
                    titulo={`Produtos do pedido nº ${pedidoAberto.id}`}
                />
            )}

        </PaginaContainer>
    )
}

export default MeusPedidos;
