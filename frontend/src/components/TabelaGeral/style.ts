
import styled from "styled-components";

export const TabelaContainer = styled.section`
    width: 100%;
    overflow-x: auto;
`;

export const Titulo = styled.h2`
    color: #2b4b3c;
    font-size: 22px;
    margin-bottom: 20px;
`;

export const Tabela = styled.table`
    width: 100%;
    border-collapse: collapse;
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
`;

export const Linha = styled.tr`
    border-bottom: 1px solid #e5e5e5;

    &:last-child {
        border-bottom: none;
    }
`;

export const Cabecalho = styled.th`
    padding: 16px;
    text-align: center;
    background-color: #2b4b3c;
    color: #ffffff;
    font-weight: 600;
    white-space: nowrap;
`;

export const Celula = styled.td`
    padding: 16px;
    color: #333333;
    text-align: center;
    vertical-align: middle;
`;
