import styled from "styled-components";

export const PaginaContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #F0E6D6;
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
    padding: 30px 2.5%;

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
`;