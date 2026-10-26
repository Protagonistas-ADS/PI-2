
import {
    FundoModal,
    ConteudoModal,
    BotaoFechar,
    ImagemProduto,
    InformacoesProduto,
    BotaoContato,
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
}

function ModalProduto({ produto, aoFechar }: ModalProdutoProps) {
    const esgotado = produto.quantidadeEstoque <= 0;

    return (
        <FundoModal onClick={aoFechar}>
            <ConteudoModal>
                <BotaoFechar
                    type="button"
                    onClick={aoFechar}
                >
                    <FiX/>
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

                    <BotaoContato type="button">
                        Falar com o proprietário
                    </BotaoContato>
                </InformacoesProduto>
            </ConteudoModal>
        </FundoModal>
    );
}

export default ModalProduto;
