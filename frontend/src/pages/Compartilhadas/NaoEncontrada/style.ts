import styled from "styled-components";

// Cores do site: verde #2b4b3c, laranja #ed8b22 (hover #d97713), bege #f0e6d6

export const ContainerPagina = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f0e6d6;
`;

export const Conteudo = styled.main`
    flex: 1;
    width: 100%;
    max-width: 640px;
    margin: 0 auto;
    padding: 64px 16px 80px;
    text-align: center;
    color: #21352b;

    h1 {
        margin: 0 0 12px;
        font-size: clamp(1.6rem, 5vw, 2.2rem);
    }

    p {
        margin: 0 auto;
        max-width: 480px;
        line-height: 1.6;
        color: #3d4f45;
    }
`;

export const Codigo = styled.span`
    display: block;
    margin-bottom: 8px;
    font-size: clamp(4.5rem, 18vw, 7rem);
    font-weight: 800;
    line-height: 1;
    color: #ed8b22;
`;

export const Acoes = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    margin-top: 32px;

    a {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 22px;
        border-radius: 10px;
        font-weight: 700;
        text-decoration: none;
    }

    .principal {
        background-color: #ed8b22;
        color: #ffffff;

        &:hover {
            background-color: #d97713;
        }
    }

    .secundario {
        border: 2px solid #2b4b3c;
        color: #2b4b3c;

        &:hover {
            background-color: #2b4b3c;
            color: #ffffff;
        }
    }

    @media (max-width: 420px) {
        flex-direction: column;

        a {
            justify-content: center;
        }
    }
`;
