import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { FiRefreshCw, FiX, FiArrowDownCircle, FiArrowUpCircle } from "react-icons/fi";

import { listarMovimentacoes, listarSaldos, registrarMovimentacao } from "../../../services/estoqueApi";
import type { Movimentacao, SaldoProduto, TipoMovimentacao } from "../../../types/estoque";

import { formatarDataHora, dentroDoPeriodo, termoDeBusca, contemTermo } from "../../../utils/filtrosAdmin";
import { obterMensagemErro } from "../../../utils/obterMensagemErro";
import { swalConfirmacao, toastSucesso } from "../../../utils/alertas";

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
    TabelaAdmin,
    FormularioAdmin
} from "../style";

type FiltroTipo = "todos" | TipoMovimentacao | "manual";

const NOME_FILTRO: Record<FiltroTipo, string> = {
    todos: "Todas",
    entrada: "Entradas",
    saida: "Saídas",
    manual: "Manuais"
};

const NOME_TIPO: Record<TipoMovimentacao, string> = {
    entrada: "Entrada",
    saida: "Saída"
};

// Mesmos limites do backend (que confere de novo)
const QUANTIDADE_MAXIMA = 1000000;

function passaNoFiltro(movimentacao: Movimentacao, filtro: FiltroTipo) {
    if (filtro === "todos") return true;
    if (filtro === "manual") return movimentacao.pedido_id === null;
    return movimentacao.tipo === filtro;
}

// Histórico do estoque (quem fez, por quê e de qual pedido) + entrada/saída manual.
function Movimentacoes() {
    const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
    const [saldos, setSaldos] = useState<SaldoProduto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState("");

    // Formulário
    const [tipo, setTipo] = useState<TipoMovimentacao>("entrada");
    const [produtoId, setProdutoId] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [motivo, setMotivo] = useState("");
    const [tentouEnviar, setTentouEnviar] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erroServidor, setErroServidor] = useState("");

    // Filtros
    const [filtro, setFiltro] = useState<FiltroTipo>("todos");
    const [busca, setBusca] = useState("");
    const [produtoFiltro, setProdutoFiltro] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");

    const carregar = useCallback(async () => {
        try {
            const [dadosMovimentacoes, dadosSaldos] = await Promise.all([listarMovimentacoes(), listarSaldos()]);
            setMovimentacoes(dadosMovimentacoes);
            setSaldos(dadosSaldos);
            setErroCarregamento("");
        } catch (error) {
            setErroCarregamento(obterMensagemErro(error, "Não foi possível carregar as movimentações."));
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    // ---------- Formulário ----------

    const produtoEscolhido = saldos.find((produto) => String(produto.id) === produtoId);
    const numeroQuantidade = Number(quantidade);

    function validar() {
        const erros: { produto?: string; quantidade?: string; motivo?: string } = {};

        if (!produtoEscolhido) erros.produto = "Escolha o produto.";

        if (!quantidade.trim() || !Number.isInteger(numeroQuantidade) || numeroQuantidade <= 0) {
            erros.quantidade = "Informe uma quantidade inteira maior que zero.";
        } else if (numeroQuantidade > QUANTIDADE_MAXIMA) {
            erros.quantidade = "A quantidade máxima por movimentação é 1.000.000.";
        } else if (tipo === "saida" && produtoEscolhido && numeroQuantidade > produtoEscolhido.quantidade_estoque) {
            erros.quantidade = `Estoque insuficiente: há ${produtoEscolhido.quantidade_estoque} un. deste produto.`;
        }

        if (motivo.trim().length < 3) erros.motivo = "Descreva o motivo (pelo menos 3 letras).";

        return erros;
    }

    const erros = tentouEnviar ? validar() : {};

    async function enviar(evento: FormEvent) {
        evento.preventDefault();
        setTentouEnviar(true);
        setErroServidor("");

        if (Object.keys(validar()).length > 0 || !produtoEscolhido) return;

        // Saída tira produto do estoque sem pedido: confirma antes
        if (tipo === "saida") {
            const resposta = await swalConfirmacao(
                `Registrar a saída de ${numeroQuantidade} un. de "${produtoEscolhido.nome}"? ` +
                `O estoque vai de ${produtoEscolhido.quantidade_estoque} para ${produtoEscolhido.quantidade_estoque - numeroQuantidade} un.`,
                "Sim, registrar saída",
                "Voltar"
            );
            if (!resposta.isConfirmed) return;
        }

        setSalvando(true);

        try {
            const resultado = await registrarMovimentacao(tipo, {
                produto_id: produtoEscolhido.id,
                quantidade: numeroQuantidade,
                motivo: motivo.trim()
            });

            toastSucesso(
                `${NOME_TIPO[tipo]} de ${resultado.quantidade} un. de "${produtoEscolhido.nome}" registrada. ` +
                `Estoque: ${resultado.saldo_anterior} → ${resultado.saldo_atual} un.`
            );

            setQuantidade("");
            setMotivo("");
            setTentouEnviar(false);
        } catch (error) {
            setErroServidor(obterMensagemErro(error, "Não foi possível registrar a movimentação."));
        } finally {
            // Recarrega sempre: o saldo pode ter mudado (inclusive por outro admin)
            await carregar();
            setSalvando(false);
        }
    }

    // ---------- Filtros ----------

    const buscadas = useMemo(() => {
        const termo = termoDeBusca(busca);

        return movimentacoes.filter((movimentacao) => {
            if (produtoFiltro && String(movimentacao.produto_id) !== produtoFiltro) return false;
            if (!dentroDoPeriodo(movimentacao.data_mov, dataInicio, dataFim)) return false;
            if (!termo) return true;

            return String(movimentacao.pedido_id) === termo
                || contemTermo(termo, movimentacao.produto_nome, movimentacao.motivo, movimentacao.responsavel_nome);
        });
    }, [movimentacoes, busca, produtoFiltro, dataInicio, dataFim]);

    const visiveis = useMemo(() => buscadas.filter((movimentacao) => passaNoFiltro(movimentacao, filtro)), [buscadas, filtro]);

    function contar(opcao: FiltroTipo) {
        return buscadas.filter((movimentacao) => passaNoFiltro(movimentacao, opcao)).length;
    }

    const totalEntradas = visiveis.filter((m) => m.tipo === "entrada").reduce((total, m) => total + m.quantidade, 0);
    const totalSaidas = visiveis.filter((m) => m.tipo === "saida").reduce((total, m) => total + m.quantidade, 0);

    const temFiltro = filtro !== "todos" || busca.trim() !== "" || produtoFiltro !== "" || dataInicio !== "" || dataFim !== "";
    const periodoInvalido = dataInicio !== "" && dataFim !== "" && dataInicio > dataFim;

    function limparFiltros() {
        setFiltro("todos");
        setBusca("");
        setProdutoFiltro("");
        setDataInicio("");
        setDataFim("");
    }

    return (
        <>
            <CabecalhoPagina>
                <h1>Movimentações de estoque</h1>
                <p>Tudo o que entrou e saiu do estoque: quem fez, por quê e de qual pedido.</p>
            </CabecalhoPagina>

            {carregando && <Mensagem>Carregando as movimentações...</Mensagem>}

            {!carregando && erroCarregamento && (
                <Mensagem>
                    <p>{erroCarregamento}</p>
                    <BotaoAtualizar type="button" onClick={() => { setCarregando(true); carregar(); }}>
                        <FiRefreshCw /> Tentar de novo
                    </BotaoAtualizar>
                </Mensagem>
            )}

            {!carregando && !erroCarregamento && (
                <>
                    <SecaoAdmin style={{ marginBottom: 24 }}>
                        <TopoSecao>
                            <div>
                                <h2>Registrar movimentação</h2>
                                <p>
                                    Use para chegada de lote, ajuste de inventário ou avaria. Pedidos confirmados e
                                    cancelados já movimentam o estoque sozinhos.
                                </p>
                            </div>
                        </TopoSecao>

                        <FormularioAdmin onSubmit={enviar} noValidate aria-label="Registrar movimentação de estoque">
                            <div className="tipos" role="group" aria-label="Tipo de movimentação">
                                <button
                                    type="button"
                                    className="entrada"
                                    aria-pressed={tipo === "entrada"}
                                    onClick={() => setTipo("entrada")}
                                >
                                    <FiArrowDownCircle aria-hidden="true" /> Entrada
                                </button>
                                <button
                                    type="button"
                                    className="saida"
                                    aria-pressed={tipo === "saida"}
                                    onClick={() => setTipo("saida")}
                                >
                                    <FiArrowUpCircle aria-hidden="true" /> Saída
                                </button>
                            </div>

                            <div className="linha">
                                <label>
                                    Produto *
                                    <select
                                        value={produtoId}
                                        onChange={(evento) => setProdutoId(evento.target.value)}
                                        aria-invalid={erros.produto ? true : undefined}
                                    >
                                        <option value="">Escolha o produto</option>
                                        {saldos.map((produto) => (
                                            <option key={produto.id} value={produto.id}>
                                                {produto.nome} ({produto.quantidade_estoque} un.){produto.ativo ? "" : " — inativo"}
                                            </option>
                                        ))}
                                    </select>
                                    {erros.produto && <span className="erro">{erros.produto}</span>}
                                </label>
                                <label>
                                    Quantidade *
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        min={1}
                                        max={QUANTIDADE_MAXIMA}
                                        step={1}
                                        value={quantidade}
                                        onChange={(evento) => setQuantidade(evento.target.value)}
                                        placeholder="Ex.: 50"
                                        aria-invalid={erros.quantidade ? true : undefined}
                                    />
                                    {erros.quantidade && <span className="erro">{erros.quantidade}</span>}
                                    {!erros.quantidade && produtoEscolhido && numeroQuantidade > 0 && Number.isInteger(numeroQuantidade) && (
                                        <span className="dica">
                                            Estoque fica em{" "}
                                            {tipo === "entrada"
                                                ? produtoEscolhido.quantidade_estoque + numeroQuantidade
                                                : produtoEscolhido.quantidade_estoque - numeroQuantidade}{" "}
                                            un.
                                        </span>
                                    )}
                                </label>
                            </div>

                            <label>
                                Motivo *
                                <input
                                    value={motivo}
                                    onChange={(evento) => setMotivo(evento.target.value)}
                                    placeholder={tipo === "entrada" ? "Ex.: Chegada de lote do fornecedor" : "Ex.: Palete quebrado (avaria)"}
                                    maxLength={255}
                                    aria-invalid={erros.motivo ? true : undefined}
                                />
                                {erros.motivo && <span className="erro">{erros.motivo}</span>}
                            </label>

                            {erroServidor && <p className="erro" role="alert">{erroServidor}</p>}

                            <div className="acoes-formulario">
                                <button type="submit" className="botao-principal" disabled={salvando}>
                                    {salvando ? "Salvando..." : tipo === "entrada" ? "Registrar entrada" : "Registrar saída"}
                                </button>
                            </div>
                        </FormularioAdmin>
                    </SecaoAdmin>

                    <SecaoAdmin>
                        <TopoSecao>
                            <div>
                                <h2>Histórico</h2>
                                <p>Da mais recente para a mais antiga.</p>
                            </div>
                            <BotaoAtualizar type="button" onClick={carregar} disabled={salvando}>
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
                                    placeholder="Produto, motivo, responsável ou nº do pedido"
                                    maxLength={100}
                                />
                            </label>
                            <label>
                                Produto
                                <select value={produtoFiltro} onChange={(evento) => setProdutoFiltro(evento.target.value)}>
                                    <option value="">Todos</option>
                                    {saldos.map((produto) => (
                                        <option key={produto.id} value={produto.id}>{produto.nome}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                De
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
                            <BotaoAtualizar type="button" onClick={limparFiltros} disabled={!temFiltro}>
                                <FiX /> Limpar
                            </BotaoAtualizar>
                        </BarraBusca>

                        <Filtros role="group" aria-label="Filtrar movimentações por tipo">
                            {(Object.keys(NOME_FILTRO) as FiltroTipo[]).map((opcao) => (
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

                        {periodoInvalido ? (
                            <Mensagem>A data inicial é depois da data final. Ajuste o período.</Mensagem>
                        ) : visiveis.length === 0 ? (
                            <Mensagem>
                                {movimentacoes.length === 0
                                    ? "Nenhuma movimentação registrada ainda."
                                    : "Nenhuma movimentação encontrada com esses filtros."}
                                {temFiltro && (
                                    <BotaoAtualizar type="button" onClick={limparFiltros}>
                                        <FiX /> Limpar filtros
                                    </BotaoAtualizar>
                                )}
                            </Mensagem>
                        ) : (
                            <>
                                <ResumoLista aria-live="polite">
                                    Mostrando <strong>{visiveis.length}</strong> de {movimentacoes.length}{" "}
                                    {movimentacoes.length === 1 ? "movimentação" : "movimentações"} · entradas{" "}
                                    <strong>+{totalEntradas} un.</strong> · saídas <strong>−{totalSaidas} un.</strong>
                                </ResumoLista>

                                <RolagemTabela>
                                    <TabelaAdmin>
                                        <thead>
                                            <tr>
                                                <th>Data</th>
                                                <th>Produto</th>
                                                <th>Tipo</th>
                                                <th>Quantidade</th>
                                                <th>Motivo</th>
                                                <th>Responsável</th>
                                                <th>Origem</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {visiveis.map((movimentacao) => (
                                                <tr key={movimentacao.id}>
                                                    <td data-rotulo="Data">{formatarDataHora(movimentacao.data_mov)}</td>
                                                    <td data-rotulo="Produto"><strong>{movimentacao.produto_nome}</strong></td>
                                                    <td data-rotulo="Tipo">
                                                        <span className={`status status-${movimentacao.tipo}`}>
                                                            {NOME_TIPO[movimentacao.tipo]}
                                                        </span>
                                                    </td>
                                                    <td data-rotulo="Quantidade">
                                                        <span className={`qtd-${movimentacao.tipo}`}>
                                                            {movimentacao.tipo === "entrada" ? "+" : "−"}{movimentacao.quantidade} un.
                                                        </span>
                                                    </td>
                                                    <td data-rotulo="Motivo" className="cliente">
                                                        {movimentacao.motivo ?? <span className="sem-acao">Não informado</span>}
                                                    </td>
                                                    <td data-rotulo="Responsável">
                                                        {movimentacao.responsavel_nome ?? <span className="sem-acao">—</span>}
                                                    </td>
                                                    <td data-rotulo="Origem">
                                                        {movimentacao.pedido_id !== null
                                                            ? `Pedido nº ${movimentacao.pedido_id}`
                                                            : <span className="sem-acao">Manual</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </TabelaAdmin>
                                </RolagemTabela>
                            </>
                        )}
                    </SecaoAdmin>
                </>
            )}
        </>
    );
}

export default Movimentacoes;
