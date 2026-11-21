import styled from "styled-components";

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
    position: relative;

    .button-alterar-nome {
        background-color: #e8912a;
        border: none;
        border-radius: 8px;
        padding: 10px 18px;
        color: #fff;
        cursor: pointer;
    }

    .campo-senha {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
    }

    .icone-senha {
        display: flex;
        align-items: center;
        justify-content: center;

        padding: 10px;
        border: none;
        border-radius: 6px;

        background-color: #d97713;
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

// Caixa de aviso (carregando ou erro ao buscar os dados da conta)
export const AvisoConta = styled.section`
    padding: 28px;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    color: #2b4b3c;
    text-align: center;

    p {
        margin: 0;
        line-height: 1.6;
    }

    button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-top: 16px;
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
