import { useState, type ChangeEvent } from "react";

import {
    FundoModal,
    ConteudoModal,
    BotaoFechar,
    ImagemProduto,
    InformacoesProduto,
    BotaoContato,
    CampoQuantidade,
} from "./style";
import { FiX } from "react-icons/fi";

interface Produto {
    readonly id: number;
    nome: string;
    imagem: string;
    descricao: string;
    preco: number;
    quantidadeEstoque: number;
}

interface ModalProdutoProps {
    produto: Produto;
    aoFechar: () => void;
    aoAdicionar: (produto: Produto, quantidade: number) => void;
}

function ModalProduto({ produto, aoFechar, aoAdicionar }: ModalProdutoProps) {
    const [quantidade, setQuantidade] = useState(1);

    const esgotado = produto.quantidadeEstoque <= 0;

    function handleAdicionar() {
        if (quantidade < 1 || quantidade > produto.quantidadeEstoque) {
            return;
        }

        aoAdicionar(produto, quantidade);
        aoFechar();
    }

    function handleQuantidade(event: ChangeEvent<HTMLInputElement>) {
        const valor = Number(event.target.value);

        if (Number.isInteger(valor) && valor >= 1 && valor <= produto.quantidadeEstoque) {
            setQuantidade(valor);
        }
    }

    return (
        <FundoModal>
            <ConteudoModal>
                <BotaoFechar
                    type="button"
                    onClick={aoFechar}
                >
                    <FiX size={'48px'} />
                </BotaoFechar>

                <ImagemProduto
                    src={produto.imagem}
                    alt={produto.nome}
                />

                <InformacoesProduto>
                    <h2>{produto.nome}</h2>

                    <p>{produto.descricao}</p>

                    <strong>
                        R$ {produto.preco}
                    </strong>

                    {esgotado
                        ? <span
                            style={{
                                backgroundColor: "#cc1010",
                                fontWeight: "bold",
                                color: "#fff",
                                borderRadius: "6px",
                                padding: "2px"
                            }}>
                            Produto esgotado
                        </span>
                        : <span
                            style={{
                                color: "#5d6d63",
                                fontWeight: "bold"
                            }}>
                            Quantidade em estoque: {produto.quantidadeEstoque} lotes
                        </span>
                    }

                    {!esgotado && (
                        <>
                            <label htmlFor="quantidade">Quantidade:</label>

                            <CampoQuantidade
                                id="quantidade"
                                type="number"
                                min={1}
                                max={produto.quantidadeEstoque}
                                step={1}
                                value={quantidade}
                                onChange={handleQuantidade}
                            />
                        </>
                    )}

                    <BotaoContato
                        type="button"
                        disabled={esgotado}
                        onClick={handleAdicionar}
                    >
                        Adicionar ao carrinho
                    </BotaoContato>
                </InformacoesProduto>
            </ConteudoModal>
        </FundoModal>
    );
}

export default ModalProduto;
