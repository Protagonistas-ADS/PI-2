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
    descricao: string;
    preco_unitario: number;
    quantidade_estoque: number;
    imagem: string;
}

interface ModalProdutoProps {
    produto: Produto;
    aoFechar: () => void;
    aoAdicionar: (produto: Produto, quantidade: number) => void;
}

function ModalProduto({ produto, aoFechar, aoAdicionar }: ModalProdutoProps) {
    const [quantidade, setQuantidade] = useState(1);

    const esgotado = produto.quantidade_estoque <= 0;

    function handleAdicionar() {
        if (quantidade < 1 || quantidade > produto.quantidade_estoque) {
            return;
        }

        aoAdicionar(produto, quantidade);
        aoFechar();
    }

    function handleQuantidade(event: ChangeEvent<HTMLInputElement>) {
        const valor = Number(event.target.value);

        if (Number.isInteger(valor) && valor >= 1 && valor <= produto.quantidade_estoque) {
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
                        R$ {produto.preco_unitario}
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
                            Quantidade em estoque: {produto.quantidade_estoque} lotes
                        </span>
                    }

                    {!esgotado && (
                        <>
                            <label htmlFor="quantidade">Quantidade:</label>

                            <CampoQuantidade
                                id="quantidade"
                                type="number"
                                min={1}
                                max={produto.quantidade_estoque}
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
