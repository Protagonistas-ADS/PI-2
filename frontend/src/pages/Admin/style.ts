import styled from "styled-components";

// Estilos repetidos nas telas do administrador

export const CabecalhoPagina = styled.header`
    margin-bottom: 24px;

    h1 {
        color: #2b4b3c;
        font-size: 1.9rem;
    }

    p {
        margin-top: 6px;
        color: #4b5b52;
    }

    @media (max-width: 600px) {
        h1 {
            font-size: 1.5rem;
        }
    }
`;

export const CaixaAviso = styled.section`
    padding: 32px;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    color: #2b4b3c;
    line-height: 1.6;

    a {
        color: #d97713;
        font-weight: bold;
    }
`;
