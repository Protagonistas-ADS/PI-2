import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiRefreshCw, FiX } from "react-icons/fi";

import ModalCarrinho from "../../../components/Modais/ModalCarrinho";
import ModalNota from "../componentes/ModalNota";

import { listarVendas } from "../../../services/vendaApi";
import { listarItensPedidoAdmin } from "../../../services/pedidoApi";
import type { Venda } from "../../../types/venda";

import { formatarData, dentroDoPeriodo, termoDeBusca, contemTermo } from "../../../utils/filtrosAdmin";
import { obterMensagemErro } from "../../../utils/obterMensagemErro";
import { formatarPreco } from "../../../utils/produto";
import { swalErro } from "../../../utils/alertas";

import {
    CabecalhoPagina,
    SecaoAdmin,
    TopoSecao,
    Filtros,
    BotaoFiltro,
    BotaoAtualizar,
    BarraBusca,
    ResumoLista,
    Mensagem,
    RolagemTabela,
    TabelaAdmin
} from "../style";

type FiltroNota = "todas" | "com_nota" | "sem_nota";

const NOME_FILTRO: Record<FiltroNota, string> = {
    todas: "Todas",
    com_nota: "Com nota",
    sem_nota: "Sem nota"
};

type Ordem = "recentes" | "antigas" | "maior_valor" | "menor_valor";

const NOME_ORDEM: Record<Ordem, string> = {
    recentes: "Mais recentes",
    antigas: "Mais antigas",
    maior_valor: "Maior valor",
    menor_valor: "Menor valor"
};

function ordenar(lista: Venda[], ordem: Ordem) {
    const copia = [...lista];

    switch (ordem) {
        case "antigas":
            return copia.reverse(); // a API manda da mais nova para a mais antiga
        case "maior_valor":
            return copia.sort((a, b) => b.valor_total - a.valor_total || b.id - a.id);
        case "menor_valor":
            return copia.sort((a, b) => a.valor_total - b.valor_total || b.id - a.id);
        default:
            return copia;
    }
}

function temNota(venda: Venda) {
    return venda.nota_id !== null;
}

interface ItemJanela {
    produto: { id: number; nome: string; preco_unitario: number };
    quantidade: number;
}

// Tabela de vendas: cada pedido entregue vira uma venda (automático).
// Daqui o admin registra a nota fiscal emitida no Emitte.
function Vendas() {
    const [vendas, setVendas] = useState<Venda[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState("");

    const [filtroNota, setFiltroNota] = useState<FiltroNota>("todas");
    const [busca, setBusca] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [ordem, setOrdem] = useState<Ordem>("recentes");

    const [vendaParaNota, setVendaParaNota] = useState<Venda | null>(null);
    const [pedidoAberto, setPedidoAberto] = useState<{ id: number; itens: ItemJanela[] } | null>(null);

    const carregar = useCallback(async () => {
        try {
            setVendas(await listarVendas());
            setErroCarregamento("");
        } catch (error) {
            setErroCarregamento(obterMensagemErro(error, "Não foi possível carregar as vendas."));
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    async function abrirItens(pedidoId: number) {
        try {
            const produtos = await listarItensPedidoAdmin(pedidoId);

            setPedidoAberto({
                id: pedidoId,
                itens: produtos.map((produto) => ({
                    produto: { id: produto.produto_id, nome: produto.produto_nome, preco_unitario: produto.preco_unitario },
                    quantidade: produto.quantidade
                }))
            });
        } catch (error) {
            swalErro(obterMensagemErro(error, "Não foi possível abrir os itens da venda."));
        }
    }

    // Busca e período valem para tudo; o filtro de nota é aplicado por último
    const vendasBuscadas = useMemo(() => {
        const termo = termoDeBusca(busca);

        return vendas.filter((venda) => {
            if (!dentroDoPeriodo(venda.data_venda, dataInicio, dataFim)) return false;
            if (!termo) return true;

            return String(venda.id) === termo
                || String(venda.pedido_id) === termo
                || contemTermo(termo, venda.cliente_nome, venda.cliente_email, venda.nota_numero);
        });
    }, [vendas, busca, dataInicio, dataFim]);

    const vendasVisiveis = useMemo(() => {
        const filtradas = vendasBuscadas.filter((venda) =>
            filtroNota === "todas" || (filtroNota === "com_nota" ? temNota(venda) : !temNota(venda))
        );

        return ordenar(filtradas, ordem);
    }, [vendasBuscadas, filtroNota, ordem]);

    function contar(opcao: FiltroNota) {
        if (opcao === "todas") return vendasBuscadas.length;
        return vendasBuscadas.filter((venda) => (opcao === "com_nota" ? temNota(venda) : !temNota(venda))).length;
    }

    const temFiltro = filtroNota !== "todas" || busca.trim() !== "" || dataInicio !== "" || dataFim !== "";
    const periodoInvalido = dataInicio !== "" && dataFim !== "" && dataInicio > dataFim;
    const valorVisivel = vendasVisiveis.reduce((total, venda) => total + venda.valor_total, 0);
    const ticketMedio = vendasVisiveis.length > 0 ? valorVisivel / vendasVisiveis.length : 0;

    function limparFiltros() {
        setFiltroNota("todas");
        setBusca("");
        setDataInicio("");
        setDataFim("");
        setOrdem("recentes");
    }

    return (
        <>
            <CabecalhoPagina>
                <h1>Vendas</h1>
                <p>Cada pedido entregue vira uma venda automaticamente. Registre aqui a nota fiscal emitida no Emitte.</p>
            </CabecalhoPagina>

            {carregando && <Mensagem>Carregando as vendas...</Mensagem>}

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
                            <h2>Lista de vendas</h2>
                            <p>Vendas sem nota mostram o botão "Emitir nota".</p>
                        </div>
                        <BotaoAtualizar type="button" onClick={carregar}>
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
                                placeholder="Nº da venda ou do pedido, cliente ou nº da nota"
                                maxLength={100}
                            />
                        </label>
                        <label>
                            Vendida de
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

                    <Filtros role="group" aria-label="Filtrar vendas pela nota fiscal">
                        {(Object.keys(NOME_FILTRO) as FiltroNota[]).map((opcao) => (
                            <BotaoFiltro
                                key={opcao}
                                type="button"
                                $ativo={filtroNota === opcao}
                                aria-pressed={filtroNota === opcao}
                                onClick={() => setFiltroNota(opcao)}
                            >
                                {NOME_FILTRO[opcao]} ({contar(opcao)})
                            </BotaoFiltro>
                        ))}
                    </Filtros>

                    {periodoInvalido ? (
                        <Mensagem>A data inicial é depois da data final. Ajuste o período.</Mensagem>
                    ) : vendasVisiveis.length === 0 ? (
                        <Mensagem>
                            {vendas.length === 0
                                ? "Nenhuma venda ainda. As vendas aparecem quando um pedido é marcado como entregue."
                                : "Nenhuma venda encontrada com esses filtros."}
                            {temFiltro && (
                                <BotaoAtualizar type="button" onClick={limparFiltros}>
                                    <FiX /> Limpar filtros
                                </BotaoAtualizar>
                            )}
                        </Mensagem>
                    ) : (
                        <>
                            <ResumoLista aria-live="polite">
                                Mostrando <strong>{vendasVisiveis.length}</strong> de {vendas.length}{" "}
                                {vendas.length === 1 ? "venda" : "vendas"} · total de{" "}
                                <strong>{formatarPreco(valorVisivel)}</strong> · média de{" "}
                                <strong>{formatarPreco(ticketMedio)}</strong> por venda
                            </ResumoLista>

                            <RolagemTabela>
                                <TabelaAdmin>
                                    <thead>
                                        <tr>
                                            <th>Venda</th>
                                            <th>Pedido</th>
                                            <th>Cliente</th>
                                            <th>Valor</th>
                                            <th>Nota fiscal</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vendasVisiveis.map((venda) => (
                                            <tr key={venda.id}>
                                                <td data-rotulo="Venda">
                                                    <div>
                                                        <strong>nº {venda.id}</strong>
                                                        <span className="detalhe">em {formatarData(venda.data_venda)}</span>
                                                    </div>
                                                </td>
                                                <td data-rotulo="Pedido">
                                                    <div>
                                                        <strong>nº {venda.pedido_id}</strong>
                                                        <button
                                                            type="button"
                                                            className="botao-itens"
                                                            onClick={() => abrirItens(venda.pedido_id)}
                                                        >
                                                            {venda.quantidade_total} {venda.quantidade_total === 1 ? "unidade" : "unidades"}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td data-rotulo="Cliente" className="cliente">
                                                    <div>
                                                        <strong>{venda.cliente_nome}</strong>
                                                        <span className="detalhe">{venda.cliente_email}</span>
                                                    </div>
                                                </td>
                                                <td data-rotulo="Valor">{formatarPreco(venda.valor_total)}</td>
                                                <td data-rotulo="Nota fiscal">
                                                    {temNota(venda)
                                                        ? <span className="status status-emitida">{venda.nota_numero}</span>
                                                        : <span className="status status-sem-nota">Sem nota</span>}
                                                </td>
                                                <td data-rotulo="Ações">
                                                    {temNota(venda) ? (
                                                        <Link to="/admin/notas" className="link-pdf">Ver notas</Link>
                                                    ) : (
                                                        <div className="acoes">
                                                            <button
                                                                type="button"
                                                                className="acao-avancar"
                                                                onClick={() => setVendaParaNota(venda)}
                                                            >
                                                                Emitir nota
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </TabelaAdmin>
                            </RolagemTabela>
                        </>
                    )}
                </SecaoAdmin>
            )}

            {vendaParaNota && (
                <ModalNota
                    modo={{ tipo: "emitir", venda: vendaParaNota }}
                    aoFechar={() => setVendaParaNota(null)}
                    aoSalvar={carregar}
                />
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

export default Vendas;
