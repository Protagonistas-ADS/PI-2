
import styled from "styled-components";

export const GradeProdutos = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 280px));
    justify-content: center;
    gap: 32px;
    width: 100%;
`;

export const CardProduto = styled.article`
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 0;
    overflow: hidden;


    background-color: #ffffff;
    border: 1px solid #dce2de;
    border-radius: 20px;
    box-shadow: 0 8px 24px rgba(33, 53, 43, 0.08);
`;

export const ImagemProduto = styled.img`
    display: block;
    width: 100%;
    height: 200px;
    object-fit: cover;
    background-color: #f0e6d5;
`;

export const EtiquetaEsgotado = styled.span`
    position: absolute;
    top: 12px;
    right: 12px;

    padding: 6px 12px;
    border-radius: 6px;

    background-color: #ad1717;
    color: #ffffff;
    font-size: 0.85rem;
    font-weight: bold;
`;

export const InformacoesProduto = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 10px;
    padding: 24px;

    h3 {
        margin: 0;
        color: #2b4b3c;
        font-size: 1.35rem;
        line-height: 1.4;
    }

    p {
        margin: 0;
        color: #5d6d63;
        font-size: 1rem;
        line-height: 1.65;
    }
`;

export const PrecoProduto = styled.strong`
    margin-top: auto;
    color: #ed8b22;
    font-size: 1.6rem;
    line-height: 1.3;
`;

export const SeletorQuantidade = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;

        border: 1px solid #cbd5ce;
        border-radius: 10px;
        background-color: #ffffff;
        color: #2b4b3c;
        cursor: pointer;

        &:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }
    }

    input {
        width: 64px;
        height: 40px;
        text-align: center;

        border: 1px solid #cbd5ce;
        border-radius: 10px;
        color: #21352b;
        font-size: 1rem;

        &:focus {
            outline: none;
            border-color: #5d806b;
            box-shadow: 0 0 0 2px rgba(93, 128, 107, 0.15);
        }
    }
`;

export const AcoesCard = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 8px;
`;

export const BotaoAdicionar = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 14px 20px;

    border: none;
    border-radius: 14px;
    background-color: #ed8b22;
    color: #ffffff;

    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover:not(:disabled) {
        background-color: #d97713;
    }

    &:disabled {
        background-color: #c9cfcb;
        cursor: not-allowed;
    }
`;

// "Saber mais" agora só abre os detalhes, por isso fica com aparência secundária
export const BotaoSaberMais = styled.button`
    width: 100%;
    padding: 12px 20px;

    border: 1px solid #2b4b3c;
    border-radius: 14px;
    background-color: transparent;
    color: #2b4b3c;

    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #eef2ef;
    }
`;
