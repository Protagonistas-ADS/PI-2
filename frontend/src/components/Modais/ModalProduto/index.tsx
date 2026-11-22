import { useEffect, useState, type MouseEvent } from "react";
import { FiX } from "react-icons/fi";

import type { Produto } from "../../../types/produto";
import { buscar } from "../../../services/produtoApi";
import { formatarPreco, urlImagemProduto, usarImagemPadrao } from "../../../utils/produto";

import {
    FundoModal,
    ConteudoModal,
    BotaoFechar,
    ImagemProduto,
    InformacoesProduto,
    EtiquetaEstoque,
    BotaoVoltar,
} from "./style";

interface ModalProdutoProps {
    produto: Produto;
    aoFechar: () => void;
}

// "Saber mais": janela só de detalhes do produto (a compra fica no card do catálogo).
function ModalProduto({ produto, aoFechar }: ModalProdutoProps) {
    // Mostra na hora o que já veio da lista e atualiza com os dados mais recentes do servidor
    const [detalhes, setDetalhes] = useState<Produto>(produto);
    const [indisponivel, setIndisponivel] = useState(false);

    useEffect(() => {
        let ativo = true;

        buscar(produto.id)
            .then((dados) => { if (ativo) setDetalhes(dados); })
            .catch(() => { if (ativo) setIndisponivel(true); });

        return () => { ativo = false; };
    }, [produto.id]);

    // Fecha com a tecla Esc
    useEffect(() => {
        function aoApertarTecla(event: KeyboardEvent) {
            if (event.key === "Escape") aoFechar();
        }

        window.addEventListener("keydown", aoApertarTecla);
        return () => window.removeEventListener("keydown", aoApertarTecla);
    }, [aoFechar]);

    function impedirFechamento(event: MouseEvent<HTMLDivElement>) {
        event.stopPropagation();
    }

    const esgotado = indisponivel || !detalhes.disponivel;

    return (
        <FundoModal onClick={aoFechar}>
            <ConteudoModal
                role="dialog"
                aria-modal="true"
                aria-label={`Detalhes de ${detalhes.nome}`}
                onClick={impedirFechamento}
            >
                <BotaoFechar
                    type="button"
                    onClick={aoFechar}
                    aria-label="Fechar detalhes"
                >
                    <FiX size={'40px'} />
                </BotaoFechar>

                <ImagemProduto
                    src={urlImagemProduto(detalhes.imagem)}
                    alt={detalhes.nome}
                    onError={usarImagemPadrao}
                />

                <InformacoesProduto>
                    <h2>{detalhes.nome}</h2>

                    <p>{detalhes.descricao}</p>

                    <strong>{formatarPreco(detalhes.preco_unitario)}</strong>

                    <EtiquetaEstoque $esgotado={esgotado}>
                        {indisponivel
                            ? "Produto indisponível no momento"
                            : esgotado
                                ? "Produto esgotado"
                                : "Disponível para pedido"}
                    </EtiquetaEstoque>

                    <BotaoVoltar type="button" onClick={aoFechar}>
                        Voltar ao catálogo
                    </BotaoVoltar>
                </InformacoesProduto>
            </ConteudoModal>
        </FundoModal>
    );
}

export default ModalProduto;
