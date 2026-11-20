import { useCallback, useEffect, useMemo, useState } from "react";
import { FiClock, FiCalendar, FiAlertTriangle, FiDollarSign, FiRefreshCw } from "react-icons/fi";

import ModalCarrinho from "../../../components/Modais/ModalCarrinho";

import { buscarResumoDashboard } from "../../../services/adminApi";
import { listarTodosPedidos, listarItensPedidoAdmin, alterarStatusPedido } from "../../../services/pedidoApi";
import type { ResumoDashboard } from "../../../types/admin";
import {
    NOME_STATUS_PEDIDO,
    type PedidoComCliente,
    type StatusPedido,
    type NovoStatusPedido
} from "../../../types/pedido";

import { obterMensagemErro } from "../../../utils/obterMensagemErro";
import { formatarPreco } from "../../../utils/produto";
import { swalConfirmacao, swalErro, toastSucesso } from "../../../utils/alertas";

import { CabecalhoPagina } from "../style";
import {
    GradeIndicadores,
    CartaoIndicador,
    SecaoPedidos,
    TopoSecao,
    Filtros,
    BotaoFiltro,
    BotaoAtualizar,
    RolagemTabela,
    TabelaPedidos,
    Mensagem
} from "./style";

// Pedidos que ainda precisam de alguma ação da loja
type StatusEmAndamento = "pendente" | "confirmado" | "pronto_retirada";
const STATUS_EM_ANDAMENTO: StatusEmAndamento[] = ["pendente", "confirmado", "pronto_retirada"];

// Próximo passo de cada status (o mesmo fluxo que o backend aceita)
const PROXIMO_PASSO: Record<StatusEmAndamento, { status: NovoStatusPedido; texto: string }> = {
    pendente: { status: "confirmado", texto: "Confirmar" },
    confirmado: { status: "pronto_retirada", texto: "Marcar pronto" },
    pronto_retirada: { status: "entregue", texto: "Entregue" }
};

const MENSAGEM_SUCESSO: Record<NovoStatusPedido, string> = {
    confirmado: "confirmado (estoque baixado)",
    pronto_retirada: "marcado como pronto para retirada",
    entregue: "entregue (venda registrada)",
    cancelado: "cancelado"
};

type Filtro = "todos" | StatusEmAndamento;

const NOME_FILTRO: Record<Filtro, string> = {
    todos: "Todos",
    pendente: "Pendentes",
    confirmado: "Confirmados",
    pronto_retirada: "Prontos"
};

function emAndamento(status: StatusPedido): status is StatusEmAndamento {
    return (STATUS_EM_ANDAMENTO as StatusPedido[]).includes(status);
}

// "2026-11-21T03:00:00.000Z" -> "21/11/2026" (no horário do navegador)
function formatarData(valor: string | null) {
    return valor ? new Date(valor).toLocaleDateString("pt-BR") : null;
}

function ehHoje(valor: string | null) {
    return valor !== null && formatarData(valor) === new Date().toLocaleDateString("pt-BR");
}

interface ItemJanela {
    produto: { id: number; nome: string; preco_unitario: number };
    quantidade: number;
}

function Dashboard() {
    const [resumo, setResumo] = useState<ResumoDashboard | null>(null);
    const [pedidos, setPedidos] = useState<PedidoComCliente[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState("");
    const [filtro, setFiltro] = useState<Filtro>("todos");
    const [pedidoOcupado, setPedidoOcupado] = useState<number | null>(null);
    const [pedidoAberto, setPedidoAberto] = useState<{ id: number; itens: ItemJanela[] } | null>(null);

    // Busca os números e a lista juntos
    const carregar = useCallback(async () => {
        try {
            const [dadosResumo, dadosPedidos] = await Promise.all([
                buscarResumoDashboard(),
                listarTodosPedidos()
            ]);

            setResumo(dadosResumo);
            setPedidos(dadosPedidos);
            setErroCarregamento("");
        } catch (error) {
            setErroCarregamento(obterMensagemErro(error, "Não foi possível carregar o painel."));
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    const pedidosEmAndamento = useMemo(
        () => pedidos.filter((pedido) => emAndamento(pedido.status)),
        [pedidos]
    );

    const pedidosFiltrados = filtro === "todos"
        ? pedidosEmAndamento
        : pedidosEmAndamento.filter((pedido) => pedido.status === filtro);

    function contar(filtroEscolhido: Filtro) {
        return filtroEscolhido === "todos"
            ? pedidosEmAndamento.length
            : pedidosEmAndamento.filter((pedido) => pedido.status === filtroEscolhido).length;
    }

    async function mudarStatus(pedido: PedidoComCliente, novoStatus: NovoStatusPedido) {
        // Cancelar e entregar pedem confirmação (entregar gera a venda e não volta)
        if (novoStatus === "cancelado") {
            const devolveEstoque = pedido.status !== "pendente";
            const resposta = await swalConfirmacao(
                `Cancelar o pedido nº ${pedido.id} de ${pedido.cliente_nome}?` +
                (devolveEstoque ? " Os produtos voltam para o estoque." : "") +
                " Isso não pode ser desfeito.",
                "Sim, cancelar pedido",
                "Voltar"
            );
            if (!resposta.isConfirmed) return;
        }

        if (novoStatus === "entregue") {
            const resposta = await swalConfirmacao(
                `Confirmar que o pedido nº ${pedido.id} foi retirado por ${pedido.cliente_nome}? ` +
                "A venda será registrada e o pedido não poderá mais ser alterado.",
                "Sim, foi entregue",
                "Voltar"
            );
            if (!resposta.isConfirmed) return;
        }

        setPedidoOcupado(pedido.id);

        try {
            await alterarStatusPedido(pedido.id, novoStatus);
            toastSucesso(`Pedido nº ${pedido.id} ${MENSAGEM_SUCESSO[novoStatus]}.`);
        } catch (error) {
            swalErro(obterMensagemErro(error, "Não foi possível alterar o status do pedido."));
        } finally {
            // Recarrega sempre: os números e a lista mudam (e outro admin pode ter mexido)
            await carregar();
            setPedidoOcupado(null);
        }
    }

    async function abrirItens(id: number) {
        try {
            const produtos = await listarItensPedidoAdmin(id);

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

    const hoje = new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long"
    });

    const mesAtual = new Date().toLocaleDateString("pt-BR", { month: "long" });

    return (
        <>
            <CabecalhoPagina>
                <h1>Dashboard</h1>
                <p>Resumo da loja — {hoje}.</p>
            </CabecalhoPagina>

            {carregando && <Mensagem>Carregando o painel...</Mensagem>}

            {!carregando && erroCarregamento && (
                <Mensagem>
                    <p>{erroCarregamento}</p>
                    <BotaoAtualizar type="button" onClick={() => { setCarregando(true); carregar(); }}>
                        <FiRefreshCw /> Tentar de novo
                    </BotaoAtualizar>
                </Mensagem>
            )}

            {!carregando && !erroCarregamento && resumo && (
                <>
                    <GradeIndicadores>
                        <CartaoIndicador $cor="#b7791f">
                            <span className="icone"><FiClock /></span>
                            <div>
                                <p className="rotulo">Pedidos pendentes</p>
                                <p className="numero">{resumo.pendentes}</p>
                                <p className="dica">Esperando sua confirmação</p>
                            </div>
                        </CartaoIndicador>

                        <CartaoIndicador $cor="#d97713">
                            <span className="icone"><FiCalendar /></span>
                            <div>
                                <p className="rotulo">A retirar hoje</p>
                                <p className="numero">{resumo.retirar_hoje}</p>
                                <p className="dica">Prontos ou marcados para hoje</p>
                            </div>
                        </CartaoIndicador>

                        <CartaoIndicador $cor="#c0392b">
                            <span className="icone"><FiAlertTriangle /></span>
                            <div>
                                <p className="rotulo">Estoque baixo</p>
                                <p className="numero">{resumo.estoque_baixo.length}</p>
                                {resumo.estoque_baixo.length === 0 ? (
                                    <p className="dica">Nenhum produto com {resumo.limite_estoque_baixo} un. ou menos</p>
                                ) : (
                                    <ul className="lista">
                                        {resumo.estoque_baixo.slice(0, 3).map((produto) => (
                                            <li key={produto.id}>
                                                {produto.nome}: <strong>{produto.quantidade_estoque} un.</strong>
                                            </li>
                                        ))}
                                        {resumo.estoque_baixo.length > 3 && (
                                            <li>e mais {resumo.estoque_baixo.length - 3}</li>
                                        )}
                                    </ul>
                                )}
                            </div>
                        </CartaoIndicador>

                        <CartaoIndicador $cor="#2b7a4b">
                            <span className="icone"><FiDollarSign /></span>
                            <div>
                                <p className="rotulo">Vendas de {mesAtual}</p>
                                <p className="numero">{formatarPreco(resumo.vendas_mes.valor_total)}</p>
                                <p className="dica">
                                    {resumo.vendas_mes.quantidade}{" "}
                                    {resumo.vendas_mes.quantidade === 1 ? "pedido entregue" : "pedidos entregues"}
                                </p>
                            </div>
                        </CartaoIndicador>
                    </GradeIndicadores>

                    <SecaoPedidos>
                        <TopoSecao>
                            <div>
                                <h2>Pedidos em andamento</h2>
                                <p>Fluxo: pendente → confirmado → pronto para retirada → entregue.</p>
                            </div>
                            <BotaoAtualizar type="button" onClick={carregar} disabled={pedidoOcupado !== null}>
                                <FiRefreshCw /> Atualizar
                            </BotaoAtualizar>
                        </TopoSecao>

                        <Filtros role="group" aria-label="Filtrar pedidos por status">
                            {(Object.keys(NOME_FILTRO) as Filtro[]).map((opcao) => (
                                <BotaoFiltro
                                    key={opcao}
                                    type="button"
                                    $ativo={filtro === opcao}
                                    aria-pressed={filtro === opcao}
                                    onClick={() => setFiltro(opcao)}
                                >
                                    {NOME_FILTRO[opcao]} ({contar(opcao)})
                                </BotaoFiltro>
                            ))}
                        </Filtros>

                        {pedidosFiltrados.length === 0 ? (
                            <Mensagem>
                                {filtro === "todos"
                                    ? "Nenhum pedido em andamento no momento."
                                    : `Nenhum pedido com o status "${NOME_FILTRO[filtro].toLowerCase()}".`}
                            </Mensagem>
                        ) : (
                            <RolagemTabela>
                                <TabelaPedidos>
                                    <thead>
                                        <tr>
                                            <th>Pedido</th>
                                            <th>Cliente</th>
                                            <th>Retirada</th>
                                            <th>Itens</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidosFiltrados.map((pedido) => {
                                            const status = pedido.status as StatusEmAndamento;
                                            const proximo = PROXIMO_PASSO[status];
                                            const ocupado = pedidoOcupado === pedido.id;
    
                                            return (
                                                <tr key={pedido.id}>
                                                    <td data-rotulo="Pedido">
                                                        <div>
                                                            <strong>nº {pedido.id}</strong>
                                                            <span className="detalhe">feito em {formatarData(pedido.criado_em)}</span>
                                                        </div>
                                                    </td>
                                                    <td data-rotulo="Cliente" className="cliente">
                                                        <div>
                                                            <strong>{pedido.cliente_nome}</strong>
                                                            <span className="detalhe">{pedido.cliente_email}</span>
                                                            {pedido.observacao && (
                                                                <span className="observacao">Obs.: {pedido.observacao}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td data-rotulo="Retirada">
                                                        {ehHoje(pedido.previsao_busca)
                                                            ? <span className="hoje">Hoje</span>
                                                            : formatarData(pedido.previsao_busca) ?? "A combinar"}
                                                    </td>
                                                    <td data-rotulo="Itens">
                                                        <button
                                                            type="button"
                                                            className="botao-itens"
                                                            onClick={() => abrirItens(pedido.id)}
                                                        >
                                                            {pedido.quantidade_total} {pedido.quantidade_total === 1 ? "unidade" : "unidades"}
                                                        </button>
                                                    </td>
                                                    <td data-rotulo="Total">{formatarPreco(pedido.valor_total)}</td>
                                                    <td data-rotulo="Status">
                                                        <span className={`status status-${pedido.status}`}>
                                                            {NOME_STATUS_PEDIDO[pedido.status]}
                                                        </span>
                                                    </td>
                                                    <td data-rotulo="Ações">
                                                        <div className="acoes">
                                                            <button
                                                                type="button"
                                                                className="acao-avancar"
                                                                disabled={pedidoOcupado !== null}
                                                                onClick={() => mudarStatus(pedido, proximo.status)}
                                                            >
                                                                {ocupado ? "Salvando..." : proximo.texto}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="acao-cancelar"
                                                                disabled={pedidoOcupado !== null}
                                                                onClick={() => mudarStatus(pedido, "cancelado")}
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </TabelaPedidos>
                            </RolagemTabela>
                        )}
                    </SecaoPedidos>
                </>
            )}

            {pedidoAberto && (
                <ModalCarrinho
                    itens={pedidoAberto.itens}
                    aoFechar={() => setPedidoAberto(null)}
                    titulo={`Produtos do pedido nº ${pedidoAberto.id}`}
                />
            )}
        </>
    );
}

export default Dashboard;
