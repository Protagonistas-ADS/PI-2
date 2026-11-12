import styled from "styled-components";

export const ContainerPagina = styled.main`
    min-height: 100vh;
    background-color: #F0E6D6;
`;

export const Conteudo = styled.section`
    width: 95%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 0;
`;

export const CabecalhoPerfil = styled.header`
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 32px;

    h1 {
        color: #2b4b3c;
        font-size: 2rem;
    }
`;

export const GridPerfil = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

export const PainelPerfil = styled.section`
    padding: 28px;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

export const GrupoCampo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 20px;

    .button-alterar-nome {
        background-color: #e8912a;
        border: none;
        border-radius: 8px;
        padding: 10px 18px;
        color: #fff;
        cursor: pointer;
    }

    label {
        font-size: 1.1rem;
        color: #2b4b3c;
        font-weight: bold;
    }
`;

export const CampoInformacao = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid #cbd5ce;
    border-radius: 8px;
    background-color: #ffffff;
    color: #21352b;
    font-size: 1rem;

    &:focus {
        outline: none;
        border-color: #5d806b;
        box-shadow: 0 0 0 2px rgba(93, 128, 107, 0.15);
    }

    &:hover {
        cursor: text;
    }
`;