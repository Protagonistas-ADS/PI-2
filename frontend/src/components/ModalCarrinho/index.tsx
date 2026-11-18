import ModalBase from "../ModalBase";
import {
    FiX,
    FiPlus,
    FiMinus,
    FiTrash2
} from "react-icons/fi";
import {
    CabecalhoCarrinho,
    ListaProdutos,
    ItemProduto,
    ResumoCarrinho,
    AcoesCarrinho,
} from "./style";

interface Produto {
    readonly id: number;
    nome: string;
    preco: number;
    quantidadeEstoque: number;
}

interface ItemCarrinho {
    produto: Produto;
    quantidade: number;
}


interface ModalCarrinhoProps {
    itens: ItemCarrinho[];
    aoFechar: () => void;
    titulo?: string;
    aoFazerPedido?: () => void;
    aoFazerCotacao?: () => void;
    aoAumentar?: (id: number) => void;
    aoDiminuir?: (id: number) => void;
    aoRemover?: (id: number) => void;
}


function ModalCarrinho({
    itens,
    titulo = "Meu Carrinho",
    aoFechar,
    aoFazerPedido,
    aoFazerCotacao,
    aoAumentar,
    aoDiminuir,
    aoRemover
}: ModalCarrinhoProps) {
    const valorTotal = itens.reduce(
        (total, item) => total + item.produto.preco * item.quantidade, 0
    );

    function formatarPreco(valor: number) {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    return (
        <ModalBase aoFechar={aoFechar}>
            <CabecalhoCarrinho>
                <h2>{titulo}</h2>

                <button type="button" onClick={aoFechar}>
                    <FiX size={'48px'} />
                </button>
            </CabecalhoCarrinho>


            <ListaProdutos>
                {itens.length === 0 ? (
                    <p>Seu carrinho está vazio.</p>
                ) : (
                    itens.map((item) => (
                        <ItemProduto key={item.produto.id}>
                            <h3>{item.produto.nome}</h3>

                            <div className="controle-quantidade">
                                <span>Quantidade:{item.quantidade}</span>

                                {aoDiminuir && aoAumentar && (
                                    <div className="botoes-quantidade">
                                        <button
                                            type="button"
                                            onClick={() => aoDiminuir?.(item.produto.id)}
                                            aria-label={`Diminuir quantidade de ${item.produto.nome}`}
                                        >
                                            <FiMinus />
                                        </button>

                                        <span>{item.quantidade}</span>

                                        <button
                                            type="button"
                                            onClick={() => aoAumentar?.(item.produto.id)}
                                            disabled={item.quantidade >= item.produto.quantidadeEstoque}
                                            aria-label={`Aumentar quantidade de ${item.produto.nome}`}
                                        >
                                            <FiPlus />
                                        </button>
                                    </div>
                                )}

                                {aoRemover && (
                                    <button
                                        className="botao-remover"
                                        type="button"
                                        onClick={() => aoRemover?.(item.produto.id)}
                                    >
                                        <FiTrash2 />
                                        Remover
                                    </button>
                                )}
                            </div>

                            <p>
                                Preço Unitário: {formatarPreco(item.produto.preco)}
                            </p>

                            <strong>
                                Subtotal: {formatarPreco(item.produto.preco * item.quantidade)}
                            </strong>
                        </ItemProduto>
                    ))
                )}
            </ListaProdutos>

            <ResumoCarrinho>
                <strong>Valor total: {formatarPreco(valorTotal)}</strong>


                {itens.length > 0 && aoFazerPedido && aoFazerCotacao && (
                    <AcoesCarrinho>
                        <button
                            className="acao-pedido"
                            type="button"
                            onClick={aoFazerPedido}
                        >
                            Fazer Pedido
                        </button>

                        <button
                            className="acao-cotacao"
                            type="button"
                            onClick={aoFazerCotacao}
                        >
                            Solicitar Cotação
                        </button>
                    </AcoesCarrinho>
                )}

            </ResumoCarrinho>
        </ModalBase>
    );
}

export default ModalCarrinho;