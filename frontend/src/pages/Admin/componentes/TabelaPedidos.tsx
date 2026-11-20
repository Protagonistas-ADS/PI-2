import { NOME_STATUS_PEDIDO, type PedidoComCliente, type NovoStatusPedido } from "../../../types/pedido";
import { PROXIMO_PASSO, emAndamento, formatarData, ehHoje } from "../../../utils/pedidoAdmin";
import { formatarPreco } from "../../../utils/produto";

import { RolagemTabela, TabelaAdmin } from "../style";

interface TabelaPedidosProps {
    pedidos: PedidoComCliente[];
    pedidoOcupado: number | null;
    aoMudarStatus: (pedido: PedidoComCliente, novoStatus: NovoStatusPedido) => void;
    aoAbrirItens: (id: number) => void;
}

// Tabela de pedidos do administrador (Dashboard e tela de Pedidos).
// Pedidos em andamento mostram os botões do próximo passo e de cancelar;
// entregues e cancelados só aparecem para consulta.
function TabelaPedidos({ pedidos, pedidoOcupado, aoMudarStatus, aoAbrirItens }: TabelaPedidosProps) {
    return (
        <RolagemTabela>
            <TabelaAdmin>
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
                    {pedidos.map((pedido) => {
                        const ocupado = pedidoOcupado === pedido.id;
                        // null = pedido finalizado (entregue ou cancelado): sem botões
                        const proximo = emAndamento(pedido.status) ? PROXIMO_PASSO[pedido.status] : null;

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
                                    {proximo && ehHoje(pedido.previsao_busca)
                                        ? <span className="hoje">Hoje</span>
                                        : formatarData(pedido.previsao_busca) ?? "A combinar"}
                                </td>
                                <td data-rotulo="Itens">
                                    <button
                                        type="button"
                                        className="botao-itens"
                                        onClick={() => aoAbrirItens(pedido.id)}
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
                                    {proximo ? (
                                        <div className="acoes">
                                            <button
                                                type="button"
                                                className="acao-avancar"
                                                disabled={pedidoOcupado !== null}
                                                onClick={() => aoMudarStatus(pedido, proximo.status)}
                                            >
                                                {ocupado ? "Salvando..." : proximo.texto}
                                            </button>
                                            <button
                                                type="button"
                                                className="acao-cancelar"
                                                disabled={pedidoOcupado !== null}
                                                onClick={() => aoMudarStatus(pedido, "cancelado")}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="sem-acao">Finalizado</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </TabelaAdmin>
        </RolagemTabela>
    );
}

export default TabelaPedidos;
