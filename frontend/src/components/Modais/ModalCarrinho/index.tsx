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

import { formatarPreco } from "../../../utils/produto";

// Só o que a janela usa de cada produto (serve para o carrinho e para os itens de um pedido)
interface ItemJanela {
    produto: {
        readonly id: number;
        nome: string;
        preco_unitario: number;
        quantidade_estoque?: number;
    };
    quantidade: number;
}

interface ModalCarrinhoProps {
    itens: ItemJanela[];
    aoFechar: () => void;
    titulo?: string;
    textoAcao?: string;
    aoAcao?: () => void;
    aoAumentar?: (id: number) => void;
    aoDiminuir?: (id: number) => void;
    aoRemover?: (id: number) => void;
}


function ModalCarrinho({
    itens,
    titulo = "Meu Carrinho",
    aoFechar,
    textoAcao = "Finalizar pedido",
    aoAcao,
    aoAumentar,
    aoDiminuir,
    aoRemover
}: ModalCarrinhoProps) {
    const valorTotal = itens.reduce(
        (total, item) => total + item.produto.preco_unitario * item.quantidade, 0
    );

    return (
        <ModalBase aoFechar={aoFechar}>
            <CabecalhoCarrinho>
                <h2>{titulo}</h2>

                <button type="button" onClick={aoFechar}>
                    <FiX size='48px' />
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
                                {!(aoDiminuir && aoAumentar) && (
                                    <span>Quantidade: {item.quantidade}</span>
                                )}

                                {aoDiminuir && aoAumentar && (
                                    <div className="botoes-quantidade">
                                        <button
                                            type="button"
                                            onClick={() => aoDiminuir(item.produto.id)}
                                            aria-label={`Diminuir quantidade de ${item.produto.nome}`}
                                        >
                                            <FiMinus />
                                        </button>

                                        <span>{item.quantidade}</span>

                                        <button
                                            type="button"
                                            onClick={() => aoAumentar(item.produto.id)}
                                            disabled={item.quantidade >= (item.produto.quantidade_estoque ?? 0)}
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
                                        onClick={() => aoRemover(item.produto.id)}
                                    >
                                        <FiTrash2 />
                                        Remover
                                    </button>
                                )}
                            </div>

                            <p>
                                Preço Unitário: {formatarPreco(item.produto.preco_unitario)}
                            </p>

                            <strong>
                                Subtotal: {formatarPreco(item.produto.preco_unitario * item.quantidade)}
                            </strong>
                        </ItemProduto>
                    ))
                )}
            </ListaProdutos>

            <ResumoCarrinho>
                <strong>Valor total: {formatarPreco(valorTotal)}</strong>


                {itens.length > 0 && aoAcao && (
                    <AcoesCarrinho>
                        <button
                            className="acao-pedido"
                            type="button"
                            onClick={aoAcao}
                        >
                            {textoAcao}
                        </button>
                    </AcoesCarrinho>
                )}

            </ResumoCarrinho>
        </ModalBase>
    );
}

export default ModalCarrinho;