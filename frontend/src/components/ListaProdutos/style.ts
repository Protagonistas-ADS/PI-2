
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

    background-color: #a83232;
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
    margin-top: 14px;
    color: #ed8b22;
    font-size: 1.6rem;
    line-height: 1.3;
`;

export const BotaoSaberMais = styled.button`
    align-self: flex-start;
    margin-top: 14px;
    padding: 16px 25px;

    border: none;
    border-radius: 14px;
    background-color: #ed8b22;
    color: #ffffff;

    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #d97713;
    }
`;
