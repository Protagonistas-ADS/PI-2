import ModalBase from "../ModalBase";
import { FiX } from "react-icons/fi";
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
}

interface ItemCarrinho {
    produto: Produto;
    quantidade: number;
}

interface ModalCarrinhoProps {
    itens: ItemCarrinho[];
    aoFechar: () => void;
    aoFazerPedido?: () => void;
    aoFazerCotacao?: () => void;
    titulo?: string;
}

function ModalCarrinho({
    itens,
    aoFechar,
    aoFazerPedido,
    aoFazerCotacao,
    titulo = "Meu Carrinho"
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
                {itens.map((item) => (
                    <ItemProduto key={item.produto.id}>
                        <h3>{item.produto.nome}</h3>

                        <p>Quantidade: {item.quantidade}</p>

                        <p>Preço Unitário: {formatarPreco(item.produto.preco)}</p>

                        <strong>
                            Subtotal: {formatarPreco(item.produto.preco * item.quantidade)}
                        </strong>
                    </ItemProduto>
                ))}
            </ListaProdutos>

            <ResumoCarrinho>
                <strong>Valor total: {formatarPreco(valorTotal)}</strong>


                {aoFazerPedido && aoFazerCotacao ? (
                    <AcoesCarrinho>
                        <button className="acao-pedido" type="button" onClick={aoFazerPedido}>
                            Fazer Pedido
                        </button>

                        <button className="acao-cotacao" type="button" onClick={aoFazerCotacao}>
                            Solicitar Cotação
                        </button>
                    </AcoesCarrinho>
                ) : null}

            </ResumoCarrinho>
        </ModalBase>
    );
}

export default ModalCarrinho;