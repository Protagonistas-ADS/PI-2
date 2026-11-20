import { useState, type ChangeEvent } from "react";
import { FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";

import type { Produto } from "../../types/produto";
import { formatarPreco, urlImagemProduto, usarImagemPadrao } from "../../utils/produto";

import {
    GradeProdutos,
    CardProduto,
    ImagemProduto,
    EtiquetaEsgotado,
    InformacoesProduto,
    PrecoProduto,
    SeletorQuantidade,
    AcoesCard,
    BotaoAdicionar,
    BotaoSaberMais,
} from "./style";

interface CardsProdutosProps {
    produtos: Produto[];
    aoSaberMais: (produto: Produto) => void;
    aoAdicionar: (produto: Produto, quantidade: number) => void;
}

interface CardProps {
    produto: Produto;
    aoSaberMais: (produto: Produto) => void;
    aoAdicionar: (produto: Produto, quantidade: number) => void;
}

function Card({ produto, aoSaberMais, aoAdicionar }: CardProps) {
    // Texto para permitir apagar o campo e digitar outro número
    const [quantidade, setQuantidade] = useState("1");

    const estoque = produto.quantidade_estoque;
    const esgotado = estoque <= 0;
    const quantidadeNumero = Number(quantidade);
    const quantidadeValida = quantidade !== "" && quantidadeNumero >= 1 && quantidadeNumero <= estoque;

    function alterarQuantidade(event: ChangeEvent<HTMLInputElement>) {
        const valor = event.target.value;

        // Só aceita dígitos e nunca passa do estoque
        if (valor === "" || /^\d+$/.test(valor)) {
            setQuantidade(valor === "" ? "" : String(Math.min(Number(valor), estoque)));
        }
    }

    function diminuir() {
        setQuantidade(String(Math.max(1, (quantidadeNumero || 1) - 1)));
    }

    function aumentar() {
        setQuantidade(String(Math.min(estoque, (quantidadeNumero || 0) + 1)));
    }

    function adicionar() {
        if (!quantidadeValida) {
            return;
        }

        aoAdicionar(produto, quantidadeNumero);
        setQuantidade("1");
    }

    return (
        <CardProduto>
            <ImagemProduto
                src={urlImagemProduto(produto.imagem)}
                alt={produto.nome}
                loading="lazy"
                onError={usarImagemPadrao}
            />

            {esgotado && (
                <EtiquetaEsgotado>
                    Em falta
                </EtiquetaEsgotado>
            )}

            <InformacoesProduto>
                <h3>{produto.nome}</h3>

                <p>{produto.descricao}</p>

                <PrecoProduto>{formatarPreco(produto.preco_unitario)}</PrecoProduto>

                {!esgotado && (
                    <SeletorQuantidade>
                        <button
                            type="button"
                            onClick={diminuir}
                            disabled={quantidadeNumero <= 1}
                            aria-label={`Diminuir quantidade de ${produto.nome}`}
                        >
                            <FiMinus />
                        </button>

                        <input
                            type="text"
                            inputMode="numeric"
                            value={quantidade}
                            onChange={alterarQuantidade}
                            aria-label={`Quantidade de ${produto.nome}`}
                        />

                        <button
                            type="button"
                            onClick={aumentar}
                            disabled={quantidadeNumero >= estoque}
                            aria-label={`Aumentar quantidade de ${produto.nome}`}
                        >
                            <FiPlus />
                        </button>
                    </SeletorQuantidade>
                )}

                <AcoesCard>
                    <BotaoAdicionar
                        type="button"
                        onClick={adicionar}
                        disabled={esgotado || !quantidadeValida}
                    >
                        <FiShoppingCart />
                        {esgotado ? "Indisponível" : "Adicionar ao carrinho"}
                    </BotaoAdicionar>

                    <BotaoSaberMais
                        type="button"
                        onClick={() => aoSaberMais(produto)}
                    >
                        Saber mais
                    </BotaoSaberMais>
                </AcoesCard>
            </InformacoesProduto>
        </CardProduto>
    );
}

function CardsProdutos({ produtos, aoSaberMais, aoAdicionar }: CardsProdutosProps) {
    return (
        <GradeProdutos>
            {produtos.map((produto) => (
                <Card
                    key={produto.id}
                    produto={produto}
                    aoSaberMais={aoSaberMais}
                    aoAdicionar={aoAdicionar}
                />
            ))}
        </GradeProdutos>
    );
}

export default CardsProdutos;
