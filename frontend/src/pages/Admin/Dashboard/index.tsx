import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiClock, FiCalendar, FiAlertTriangle, FiDollarSign, FiRefreshCw, FiList } from "react-icons/fi";

import ModalCarrinho from "../../../components/Modais/ModalCarrinho";
import TabelaPedidos from "../componentes/TabelaPedidos";

import { buscarResumoDashboard } from "../../../services/adminApi";
import { listarTodosPedidos } from "../../../services/pedidoApi";
import { useAcoesPedidoAdmin } from "../../../hooks/useAcoesPedidoAdmin";
import type { ResumoDashboard } from "../../../types/admin";
import type { PedidoComCliente } from "../../../types/pedido";

import { emAndamento, type StatusEmAndamento } from "../../../utils/pedidoAdmin";
import { obterMensagemErro } from "../../../utils/obterMensagemErro";
import { formatarPreco } from "../../../utils/produto";

import {
    CabecalhoPagina,
    SecaoAdmin,
    TopoSecao,
    Filtros,
    BotaoFiltro,
    BotaoAtualizar,
    Mensagem
} from "../style";
import { GradeIndicadores, CartaoIndicador } from "./style";

type Filtro = "todos" | StatusEmAndamento;

const NOME_FILTRO: Record<Filtro, string> = {
    todos: "Todos",
    pendente: "Pendentes",
    confirmado: "Confirmados",
    pronto_retirada: "Prontos"
};

function Dashboard() {
    const [resumo, setResumo] = useState<ResumoDashboard | null>(null);
    const [pedidos, setPedidos] = useState<PedidoComCliente[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState("");
    const [filtro, setFiltro] = useState<Filtro>("todos");

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

    const { pedidoOcupado, mudarStatus, pedidoAberto, abrirItens, fecharItens } = useAcoesPedidoAdmin(carregar);

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

                    <SecaoAdmin>
                        <TopoSecao>
                            <div>
                                <h2>Pedidos em andamento</h2>
                                <p>Fluxo: pendente → confirmado → pronto para retirada → entregue.</p>
                            </div>
                            <div className="botoes-topo">
                                <BotaoAtualizar as={Link} to="/admin/pedidos">
                                    <FiList /> Ver todos os pedidos
                                </BotaoAtualizar>
                                <BotaoAtualizar type="button" onClick={carregar} disabled={pedidoOcupado !== null}>
                                    <FiRefreshCw /> Atualizar
                                </BotaoAtualizar>
                            </div>
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
                            <TabelaPedidos
                                pedidos={pedidosFiltrados}
                                pedidoOcupado={pedidoOcupado}
                                aoMudarStatus={mudarStatus}
                                aoAbrirItens={abrirItens}
                            />
                        )}
                    </SecaoAdmin>
                </>
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

export default Dashboard;
