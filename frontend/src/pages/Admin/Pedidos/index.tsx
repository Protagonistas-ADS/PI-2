import { useCallback, useEffect, useMemo, useState } from "react";
import { FiRefreshCw, FiX } from "react-icons/fi";

import ModalCarrinho from "../../../components/Modais/ModalCarrinho";
import TabelaPedidos from "../componentes/TabelaPedidos";

import { listarTodosPedidos } from "../../../services/pedidoApi";
import { useAcoesPedidoAdmin } from "../../../hooks/useAcoesPedidoAdmin";
import type { PedidoComCliente, StatusPedido } from "../../../types/pedido";

import { dentroDoPeriodo, termoDeBusca, contemTermo } from "../../../utils/filtrosAdmin";
import { obterMensagemErro } from "../../../utils/obterMensagemErro";
import { formatarPreco } from "../../../utils/produto";

import {
    CabecalhoPagina,
    SecaoAdmin,
    TopoSecao,
    Filtros,
    BotaoFiltro,
    BotaoAtualizar,
    BarraBusca,
    ResumoLista,
    Mensagem
} from "../style";

type FiltroStatus = "todos" | StatusPedido;

const NOME_FILTRO: Record<FiltroStatus, string> = {
    todos: "Todos",
    pendente: "Pendentes",
    confirmado: "Confirmados",
    pronto_retirada: "Prontos",
    entregue: "Entregues",
    cancelado: "Cancelados"
};

type Ordem = "recentes" | "antigos" | "maior_valor" | "menor_valor";

const NOME_ORDEM: Record<Ordem, string> = {
    recentes: "Mais recentes",
    antigos: "Mais antigos",
    maior_valor: "Maior valor",
    menor_valor: "Menor valor"
};

function ordenar(lista: PedidoComCliente[], ordem: Ordem) {
    const copia = [...lista];

    switch (ordem) {
        case "antigos":
            return copia.sort((a, b) => a.id - b.id);
        case "maior_valor":
            return copia.sort((a, b) => b.valor_total - a.valor_total || b.id - a.id);
        case "menor_valor":
            return copia.sort((a, b) => a.valor_total - b.valor_total || b.id - a.id);
        default:
            return copia.sort((a, b) => b.id - a.id);
    }
}

// Tabela completa de pedidos (todos os status), com busca, período e ordenação.
// Os filtros rodam na própria tela: a lista vem inteira de GET /pedidos.
function Pedidos() {
    const [pedidos, setPedidos] = useState<PedidoComCliente[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState("");

    const [status, setStatus] = useState<FiltroStatus>("todos");
    const [busca, setBusca] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [ordem, setOrdem] = useState<Ordem>("recentes");

    const carregar = useCallback(async () => {
        try {
            setPedidos(await listarTodosPedidos());
            setErroCarregamento("");
        } catch (error) {
            setErroCarregamento(obterMensagemErro(error, "Não foi possível carregar os pedidos."));
        } finally {
            setCarregando(false);
        }
    }, []);

    const { pedidoOcupado, mudarStatus, pedidoAberto, abrirItens, fecharItens } = useAcoesPedidoAdmin(carregar);

    useEffect(() => {
        carregar();
    }, [carregar]);

    // Busca e período valem para tudo; o status é aplicado por último
    // (assim os números dos botões de status mostram quantos há em cada um)
    const pedidosBuscados = useMemo(() => {
        // "nº 12", "n 12" ou "12" procuram o pedido 12
        const termo = termoDeBusca(busca);

        return pedidos.filter((pedido) => {
            if (!dentroDoPeriodo(pedido.criado_em, dataInicio, dataFim)) return false;
            if (!termo) return true;

            return String(pedido.id) === termo || contemTermo(termo, pedido.cliente_nome, pedido.cliente_email);
        });
    }, [pedidos, busca, dataInicio, dataFim]);

    const pedidosVisiveis = useMemo(() => {
        const filtrados = status === "todos"
            ? pedidosBuscados
            : pedidosBuscados.filter((pedido) => pedido.status === status);

        return ordenar(filtrados, ordem);
    }, [pedidosBuscados, status, ordem]);

    function contar(opcao: FiltroStatus) {
        return opcao === "todos"
            ? pedidosBuscados.length
            : pedidosBuscados.filter((pedido) => pedido.status === opcao).length;
    }

    const temFiltro = status !== "todos" || busca.trim() !== "" || dataInicio !== "" || dataFim !== "";
    const periodoInvalido = dataInicio !== "" && dataFim !== "" && dataInicio > dataFim;
    const valorVisivel = pedidosVisiveis.reduce((total, pedido) => total + pedido.valor_total, 0);

    function limparFiltros() {
        setStatus("todos");
        setBusca("");
        setDataInicio("");
        setDataFim("");
        setOrdem("recentes");
    }

    return (
        <>
            <CabecalhoPagina>
                <h1>Pedidos</h1>
                <p>Todos os pedidos da loja, do mais novo ao mais antigo. Use a busca e os filtros para encontrar um pedido.</p>
            </CabecalhoPagina>

            {carregando && <Mensagem>Carregando os pedidos...</Mensagem>}

            {!carregando && erroCarregamento && (
                <Mensagem>
                    <p>{erroCarregamento}</p>
                    <BotaoAtualizar type="button" onClick={() => { setCarregando(true); carregar(); }}>
                        <FiRefreshCw /> Tentar de novo
                    </BotaoAtualizar>
                </Mensagem>
            )}

            {!carregando && !erroCarregamento && (
                <SecaoAdmin>
                    <TopoSecao>
                        <div>
                            <h2>Lista de pedidos</h2>
                            <p>Entregues e cancelados ficam só para consulta.</p>
                        </div>
                        <BotaoAtualizar type="button" onClick={carregar} disabled={pedidoOcupado !== null}>
                            <FiRefreshCw /> Atualizar
                        </BotaoAtualizar>
                    </TopoSecao>

                    <BarraBusca>
                        <label className="busca">
                            Buscar
                            <input
                                type="search"
                                value={busca}
                                onChange={(evento) => setBusca(evento.target.value)}
                                placeholder="Nº do pedido, nome ou e-mail do cliente"
                                maxLength={100}
                            />
                        </label>
                        <label>
                            Feito de
                            <input
                                type="date"
                                value={dataInicio}
                                max={dataFim || undefined}
                                onChange={(evento) => setDataInicio(evento.target.value)}
                            />
                        </label>
                        <label>
                            Até
                            <input
                                type="date"
                                value={dataFim}
                                min={dataInicio || undefined}
                                onChange={(evento) => setDataFim(evento.target.value)}
                            />
                        </label>
                        <label>
                            Ordenar por
                            <select value={ordem} onChange={(evento) => setOrdem(evento.target.value as Ordem)}>
                                {(Object.keys(NOME_ORDEM) as Ordem[]).map((opcao) => (
                                    <option key={opcao} value={opcao}>{NOME_ORDEM[opcao]}</option>
                                ))}
                            </select>
                        </label>
                        <BotaoAtualizar type="button" onClick={limparFiltros} disabled={!temFiltro && ordem === "recentes"}>
                            <FiX /> Limpar
                        </BotaoAtualizar>
                    </BarraBusca>

                    <Filtros role="group" aria-label="Filtrar pedidos por status">
                        {(Object.keys(NOME_FILTRO) as FiltroStatus[]).map((opcao) => (
                            <BotaoFiltro
                                key={opcao}
                                type="button"
                                $ativo={status === opcao}
                                aria-pressed={status === opcao}
                                onClick={() => setStatus(opcao)}
                            >
                                {NOME_FILTRO[opcao]} ({contar(opcao)})
                            </BotaoFiltro>
                        ))}
                    </Filtros>

                    {periodoInvalido ? (
                        <Mensagem>A data inicial é depois da data final. Ajuste o período.</Mensagem>
                    ) : pedidosVisiveis.length === 0 ? (
                        <Mensagem>
                            {pedidos.length === 0
                                ? "Nenhum pedido foi feito ainda."
                                : "Nenhum pedido encontrado com esses filtros."}
                            {temFiltro && (
                                <BotaoAtualizar type="button" onClick={limparFiltros}>
                                    <FiX /> Limpar filtros
                                </BotaoAtualizar>
                            )}
                        </Mensagem>
                    ) : (
                        <>
                            <ResumoLista aria-live="polite">
                                Mostrando <strong>{pedidosVisiveis.length}</strong> de {pedidos.length}{" "}
                                {pedidos.length === 1 ? "pedido" : "pedidos"} · soma de{" "}
                                <strong>{formatarPreco(valorVisivel)}</strong>
                            </ResumoLista>

                            <TabelaPedidos
                                pedidos={pedidosVisiveis}
                                pedidoOcupado={pedidoOcupado}
                                aoMudarStatus={mudarStatus}
                                aoAbrirItens={abrirItens}
                            />
                        </>
                    )}
                </SecaoAdmin>
            )}

            {pedidoAberto && (
                <ModalCarrinho
                    itens={pedidoAberto.itens}
                    aoFechar={fecharItens}
                    titulo={`Produtos do pedido nº ${pedidoAberto.id}`}
                />
            )}
        </>
    );
}

export default Pedidos;
