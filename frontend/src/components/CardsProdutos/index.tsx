import {
    GradeProdutos,
    CardProduto,
    ImagemProduto,
    EtiquetaEsgotado,
    InformacoesProduto,
    BotaoSaberMais,
    PrecoProduto,
} from "./style";

interface Produto {
    id: number;
    nome: string;
    imagem: string;
    descricao: string;
    preco: number;
    quantidadeEstoque: number;
}

interface CardsProdutosProps {
    produtos: Produto[];
    aoSaberMais: (produto: Produto) => void;
}

function CardsProdutos({ produtos, aoSaberMais }: CardsProdutosProps) {
    return (
        <GradeProdutos>
            {produtos.map((produto) => (
                <CardProduto key={produto.id}>
                    <ImagemProduto
                        src={produto.imagem}
                        alt={produto.nome}
                    />

                    {produto.quantidadeEstoque <= 0 && (
                        <EtiquetaEsgotado>
                            Em falta
                        </EtiquetaEsgotado>
                    )}

                    <InformacoesProduto>
                        <h3>{produto.nome}</h3>

                        <p>{produto.descricao}</p>

                        <PrecoProduto>R$ {produto.preco}</PrecoProduto>

                        <BotaoSaberMais
                            type="button"
                            onClick={() => aoSaberMais(produto)}
                        >
                            Saber mais
                        </BotaoSaberMais>
                    </InformacoesProduto>
                </CardProduto>
            ))}
        </GradeProdutos>
    )
}

export default CardsProdutos;