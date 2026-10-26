
import styled from "styled-components";

export const FundoModal = styled.div`
    position: fixed;
    inset: 0;
    z-index: 1000;

    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;

    backdrop-filter: blur(6px);
`;

export const ConteudoModal = styled.div`
    position: relative;
    display: flex;
    gap: 32px;

    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 32px;

    background-color: #ffffff;
    border-radius: 20px;
    box-shadow: 0 12px 40px rgba(33, 53, 43, 0.18);
`;

export const BotaoFechar = styled.button`
    position: absolute;
    top: 12px;
    right: 16px;

    border: none;
    background: transparent;
    color: #21352b;
    cursor: pointer;
`;

export const ImagemProduto = styled.img`
    width: 45%;
    object-fit: cover;
    border-radius: 12px;
    background-color: #f0e6d5;
`;

export const InformacoesProduto = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;

    h2 {
        margin: 0;
        color: #2b4b3c;
        font-size: 2rem;
    }

    p {
        margin: 0;
        color: #5d6d63;
        line-height: 1.7;
    }

    strong {
        color: #ed8b22;
        font-size: 1.8rem;
    }
`;

export const BotaoContato = styled.button`
    width: 100%;
    padding: 16px 20px;

    border: none;
    border-radius: 12px;
    background-color: #ed8b22;
    color: #ffffff;

    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;

    &:hover {
        background-color: #d97713;
    }
`;
