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
    const [quantidade, setQuantidade] = useState("1");

    const esgotado = produto.quantidade_estoque <= 0;

    function handleAdicionar() {
        const quantidade_numero = Number(quantidade);

        if (quantidade === "" || quantidade_numero < 1 || quantidade_numero > produto.quantidade_estoque) {
            return;
        }

        aoAdicionar(produto, quantidade_numero);
        aoFechar();
    }

    function handleQuantidade(event: ChangeEvent<HTMLInputElement>) {
        const valor = event.target.value;

        if (valor === "" || /^\d+$/.test(valor)) {
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

                            <CampoQuantidade
                                id="quantidade"
                                type="text"
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
