import styled from "styled-components";

export const PaginaContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #F0E6D6;
    padding-bottom: 55px;
`;

export const AbasContainer = styled.div`
    display: flex;
    gap: 10px;
    padding: 24px 5%;

    margin-top: 40px;
`;

export const Aba = styled.button<{ $ativa: boolean }>`
    padding: 14px 28px;
    border: none;
    border-radius: 12px;
    background-color: ${({ $ativa }) => $ativa ? "#2b4b3c" : "#c6c4bd"};
    color: ${({ $ativa }) => $ativa ? "#ffffff" : "#2b4b3c"};
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin: 0 5px;

    &:hover {
        background-color: ${({ $ativa }) => $ativa ? "#2b4b3c" : "#a7a59f"};
    }
`;

export const PedidosCabecalho = styled.div`
    display: flex;
    gap: 25px;
    padding: 30px;

    h1 {
        font-weight: bold;
        color: #2b4b3c;
        letter-spacing: 0.1px;
    }

`;

export const PedidosConteudo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    margin: 0 auto;
    width: 100%;
    max-width: 1200px;

    .botao-quantidade {
        background: #e8f0eb;
        color: #2b4b3c;
        border: 1px solid #2b4b3c;
        border-radius: 6px;
        padding: 5px 12px;
        cursor: pointer;
        font-weight: 600;

        &:hover {
            background: #d4e4d9;
        }
    }

    .status {
        display: inline-block;
        padding: 5px 10px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
    }

    .status-pendente {
        background: #fff3cd;
        color: #856404;
    }

    .status-respondido,
    .status-respondida {
        background: #d4edda;
        color: #155724;
    }

    .status-expirada {
        background: #e2e3e5;
        color: #383d41;
    }

    .acao-pedido {
        background: #fde8e8;
        color: #b42318;
        border: 1px solid #f5b5b5;
        border-radius: 6px;
        padding: 7px 12px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
            background: #fbd5d5;
        }
    }
`;