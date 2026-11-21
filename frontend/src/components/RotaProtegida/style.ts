import styled from "styled-components";

// Aviso de tela cheia enquanto confere a conta (carregando ou servidor fora do ar)
export const AvisoRota = styled.main`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 24px 16px;
    background-color: #f0e6d6;
    color: #2b4b3c;
    text-align: center;

    p {
        margin: 0;
        max-width: 420px;
        font-size: 1.05rem;
        line-height: 1.6;
    }

    button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        border: none;
        border-radius: 8px;
        background-color: #d97713;
        color: #ffffff;
        font-weight: 600;
        cursor: pointer;

        &:hover {
            background-color: #b56510;
        }
    }
`;
