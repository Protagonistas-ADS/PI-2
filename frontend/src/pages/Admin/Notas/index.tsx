import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiRefreshCw, FiX } from "react-icons/fi";


import { listarNotas, cancelarNota } from "../../../services/notaApi";
import { NOME_STATUS_NOTA, type NotaFiscal, type StatusNota } from "../../../types/nota";

import { formatarData, dentroDoPeriodo, termoDeBusca, contemTermo } from "../../../utils/filtrosAdmin";
import { obterMensagemErro } from "../../../utils/obterMensagemErro";
import { formatarPreco } from "../../../utils/produto";
import { swalConfirmacao, swalErro, toastSucesso } from "../../../utils/alertas";

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

type FiltroStatus = "todas" | StatusNota;

const NOME_FILTRO: Record<FiltroStatus, string> = {
    todas: "Todas",
    emitida: "Emitidas",
    cancelada: "Canceladas"
};

type Ordem = "recentes" | "antigas" | "maior_valor";

const NOME_ORDEM: Record<Ordem, string> = {
    recentes: "Mais recentes",
    antigas: "Mais antigas",
    maior_valor: "Maior valor"
};

function ordenar(lista: NotaFiscal[], ordem: Ordem) {
    const copia = [...lista];

    switch (ordem) {
        case "antigas":
            return copia.reverse(); // a API manda da mais nova para a mais antiga
        case "maior_valor":
            return copia.sort((a, b) => b.valor_total - a.valor_total || b.id - a.id);
        default:
            return copia;
    }
}

// Tabela de notas fiscais. A nota é emitida no Emitte; aqui ficam o número,
// os dados e o status. A nota nasce na entrega do pedido; a substituta, na tela de Vendas.
function Notas() {
    const [notas, setNotas] = useState<NotaFiscal[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState("");

    const [status, setStatus] = useState<FiltroStatus>("todas");
    const [busca, setBusca] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [ordem, setOrdem] = useState<Ordem>("recentes");

    const [notaOcupada, setNotaOcupada] = useState<number | null>(null);

    const carregar = useCallback(async () => {
        try {
            setNotas(await listarNotas());
            setErroCarregamento("");
        } catch (error) {
            setErroCarregamento(obterMensagemErro(error, "Não foi possível carregar as notas fiscais."));
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    async function cancelar(nota: NotaFiscal) {
        const resposta = await swalConfirmacao(
            `Cancelar a nota ${nota.numero} (venda nº ${nota.venda_id}, ${formatarPreco(nota.valor_total)})? ` +
            "Ela continua no histórico como cancelada. Depois, registre a nota substituta da venda na tela Vendas. " +
            "Lembre-se de cancelar também no Emitte.",
            "Sim, cancelar nota",
            "Voltar"
        );
        if (!resposta.isConfirmed) return;

        setNotaOcupada(nota.id);

        try {
            await cancelarNota(nota.id);
            toastSucesso(`Nota ${nota.numero} cancelada.`);
        } catch (error) {
            swalErro(obterMensagemErro(error, "Não foi possível cancelar a nota fiscal."));
        } finally {
            await carregar();
            setNotaOcupada(null);
        }
    }

    // Busca e período valem para tudo; o status é aplicado por último
    const notasBuscadas = useMemo(() => {
        const termo = termoDeBusca(busca);

        return notas.filter((nota) => {
            if (!dentroDoPeriodo(nota.data_emissao, dataInicio, dataFim)) return false;
            if (!termo) return true;

            return String(nota.pedido_id) === termo
                || String(nota.venda_id) === termo
                || contemTermo(termo, nota.numero, nota.cliente_nome);
        });
    }, [notas, busca, dataInicio, dataFim]);

    const notasVisiveis = useMemo(() => {
        const filtradas = status === "todas" ? notasBuscadas : notasBuscadas.filter((nota) => nota.status === status);
        return ordenar(filtradas, ordem);
    }, [notasBuscadas, status, ordem]);

    function contar(opcao: FiltroStatus) {
        return opcao === "todas" ? notasBuscadas.length : notasBuscadas.filter((nota) => nota.status === opcao).length;
    }

    const temFiltro = status !== "todas" || busca.trim() !== "" || dataInicio !== "" || dataFim !== "";
    const periodoInvalido = dataInicio !== "" && dataFim !== "" && dataInicio > dataFim;
    // A soma considera só as notas emitidas (cancelada não vale)
    const valorEmitido = notasVisiveis
        .filter((nota) => nota.status === "emitida")
        .reduce((total, nota) => total + nota.valor_total, 0);

    function limparFiltros() {
        setStatus("todas");
        setBusca("");
        setDataInicio("");
        setDataFim("");
        setOrdem("recentes");
    }

    return (
        <>
            <CabecalhoPagina>
                <h1>Notas fiscais</h1>
                <p>Notas emitidas no Emitte, com o número, o valor e o status.</p>
            </CabecalhoPagina>

            {carregando && <Mensagem>Carregando as notas fiscais...</Mensagem>}

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
                            <h2>Lista de notas</h2>
                            <p>
                                A nota nasce quando o pedido é marcado como entregue. Se cancelar uma nota, registre a substituta na tela de{" "}
                                <Link to="/admin/vendas">Vendas</Link>.
                            </p>
                        </div>
                        <BotaoAtualizar type="button" onClick={carregar} disabled={notaOcupada !== null}>
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
                                placeholder="Nº da nota, cliente ou nº do pedido"
                                maxLength={100}
                            />
                        </label>
                        <label>
                            Emitida de
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

                    <Filtros role="group" aria-label="Filtrar notas por status">
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
                    ) : notasVisiveis.length === 0 ? (
                        <Mensagem>
                            {notas.length === 0
                                ? "Nenhuma nota fiscal registrada ainda."
                                : "Nenhuma nota encontrada com esses filtros."}
                            {temFiltro && (
                                <BotaoAtualizar type="button" onClick={limparFiltros}>
                                    <FiX /> Limpar filtros
                                </BotaoAtualizar>
                            )}
                        </Mensagem>
                    ) : (
                        <>
                            <ResumoLista aria-live="polite">
                                Mostrando <strong>{notasVisiveis.length}</strong> de {notas.length}{" "}
                                {notas.length === 1 ? "nota" : "notas"} · emitidas somam{" "}
                                <strong>{formatarPreco(valorEmitido)}</strong>
                            </ResumoLista>

                            <RolagemTabela>
                                <TabelaAdmin>
                                    <thead>
                                        <tr>
                                            <th>Nota</th>
                                            <th>Venda / pedido</th>
                                            <th>Cliente</th>
                                            <th>Valor</th>
                                            <th>Status</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {notasVisiveis.map((nota) => {
                                            const emitida = nota.status === "emitida";

                                            return (
                                                <tr key={nota.id}>
                                                    <td data-rotulo="Nota">
                                                        <div>
                                                            <strong>{nota.numero}</strong>
                                                            <span className="detalhe">
                                                                {nota.natureza_operacao} · <span className="sem-quebra">{formatarData(nota.data_emissao)}</span>
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td data-rotulo="Venda / pedido">
                                                        <div>
                                                            <strong>Venda nº {nota.venda_id}</strong>
                                                            <span className="detalhe">Pedido nº {nota.pedido_id}</span>
                                                        </div>
                                                    </td>
                                                    <td data-rotulo="Cliente" className="cliente">{nota.cliente_nome}</td>
                                                    <td data-rotulo="Valor">{formatarPreco(nota.valor_total)}</td>
                                                    <td data-rotulo="Status">
                                                        <span className={`status status-${nota.status}`}>
                                                            {NOME_STATUS_NOTA[nota.status]}
                                                        </span>
                                                    </td>
                                                    <td data-rotulo="Ações">
                                                        {emitida ? (
                                                            <div className="acoes">
                                                                <button
                                                                    type="button"
                                                                    className="acao-cancelar"
                                                                    disabled={notaOcupada !== null}
                                                                    onClick={() => cancelar(nota)}
                                                                >
                                                                    {notaOcupada === nota.id ? "Cancelando..." : "Cancelar"}
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="sem-acao">Cancelada</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </TabelaAdmin>
                            </RolagemTabela>
                        </>
                    )}
                </SecaoAdmin>
            )}
        </>
    );
}

export default Notas;
