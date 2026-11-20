import styled from "styled-components";

const VERDE = "#2b4b3c";
const LARANJA = "#d97713";

export const GradeIndicadores = styled.section`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
    margin-bottom: 32px;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: 560px) {
        grid-template-columns: 1fr;
    }
`;

export const CartaoIndicador = styled.article<{ $cor: string }>`
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 16px;
    border-top: 5px solid ${({ $cor }) => $cor};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    .icone {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background-color: ${({ $cor }) => $cor}1f;
        color: ${({ $cor }) => $cor};
        font-size: 1.35rem;
    }

    .rotulo {
        color: #4b5b52;
        font-size: 0.95rem;
    }

    .numero {
        margin: 4px 0;
        color: ${VERDE};
        font-size: 1.9rem;
        font-weight: bold;
        overflow-wrap: anywhere;
    }

    .dica,
    .lista {
        color: #5f6b64;
        font-size: 0.85rem;
        line-height: 1.5;
    }

    .lista {
        list-style: none;
    }
`;

export const SecaoPedidos = styled.section`
    padding: 24px;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    @media (max-width: 760px) {
        padding: 16px;
    }
`;

export const TopoSecao = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 16px;

    h2 {
        color: ${VERDE};
        font-size: 1.4rem;
    }

    p {
        margin-top: 4px;
        color: #5f6b64;
        font-size: 0.9rem;
    }
`;

export const Filtros = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 18px;
`;

export const BotaoFiltro = styled.button<{ $ativo: boolean }>`
    padding: 8px 14px;
    border: 1px solid ${({ $ativo }) => ($ativo ? VERDE : "#cbd5ce")};
    border-radius: 999px;
    background-color: ${({ $ativo }) => ($ativo ? VERDE : "#ffffff")};
    color: ${({ $ativo }) => ($ativo ? "#ffffff" : VERDE)};
    font-family: inherit;
    font-size: 0.9rem;
    cursor: pointer;
`;

export const BotaoAtualizar = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border: 1px solid ${VERDE};
    border-radius: 8px;
    background-color: #ffffff;
    color: ${VERDE};
    font-family: inherit;
    font-size: 0.95rem;
    cursor: pointer;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const Mensagem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    padding: 32px 16px;
    color: #4b5b52;
    text-align: center;
`;

// Segurança extra: se algo não couber, rola só dentro da caixa, nunca a página inteira
export const RolagemTabela = styled.div`
    width: 100%;
    overflow-x: auto;
`;

export const TabelaPedidos = styled.table`
    width: 100%;
    border-collapse: collapse;

    th {
        padding: 12px;
        background-color: ${VERDE};
        color: #ffffff;
        font-weight: 600;
        text-align: left;
        white-space: nowrap;
    }

    th:first-child {
        border-top-left-radius: 8px;
    }

    th:last-child {
        border-top-right-radius: 8px;
    }

    td {
        padding: 14px 12px;
        border-bottom: 1px solid #ececec;
        color: #333333;
        vertical-align: top;
    }

    td strong {
        display: block;
        color: #21352b;
    }

    .detalhe {
        display: block;
        margin-top: 2px;
        color: #6b7280;
        font-size: 0.85rem;
        overflow-wrap: anywhere;
    }

    .observacao {
        display: block;
        margin-top: 6px;
        padding: 6px 8px;
        border-radius: 6px;
        background-color: #fff7ec;
        color: #7a4a10;
        font-size: 0.85rem;
        overflow-wrap: anywhere;
    }

    .cliente {
        max-width: 280px;
    }

    .hoje {
        padding: 4px 8px;
        border-radius: 6px;
        background-color: #ffe8cc;
        color: #9a4a00;
        font-weight: bold;
    }

    .botao-itens {
        padding: 0;
        border: none;
        background: none;
        color: ${LARANJA};
        font-family: inherit;
        font-size: 1rem;
        text-decoration: underline;
        cursor: pointer;
        white-space: nowrap;
    }

    .status {
        display: inline-block;
        padding: 5px 10px;
        border-radius: 6px;
        font-size: 0.85rem;
        font-weight: bold;
        white-space: nowrap;
    }

    .status-pendente {
        background: #fff3cd;
        color: #856404;
    }

    .status-confirmado {
        background: #dbeafe;
        color: #1e40af;
    }

    .status-pronto_retirada {
        background: #ffe8cc;
        color: #9a4a00;
    }

    .acoes {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    .acoes button {
        padding: 8px 12px;
        border-radius: 8px;
        font-family: inherit;
        font-size: 0.9rem;
        white-space: nowrap;
        cursor: pointer;
    }

    .acoes button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
    }

    .acao-avancar {
        border: none;
        background-color: ${LARANJA};
        color: #ffffff;
        font-weight: bold;
    }

    .acao-cancelar {
        border: 1px solid #c0392b;
        background-color: #ffffff;
        color: #c0392b;
    }

    /* Telas menores (tablet, notebook pequeno, celular): a tabela não cabe,
       então cada pedido vira um cartão, com o nome da coluna ao lado do valor.
       Os cartões se arrumam em 1 ou 2 colunas conforme o espaço. */
    @media (max-width: 1180px) {
        display: block;

        thead {
            display: none;
        }

        tbody {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(min(100%, 330px), 1fr));
            gap: 14px;
        }

        tr {
            display: block;
            padding: 6px 12px;
            border: 1px solid #e5e5e5;
            border-radius: 12px;
        }

        td {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
            padding: 10px 0;
            text-align: right;
        }

        tr td:last-child {
            border-bottom: none;
        }

        td::before {
            content: attr(data-rotulo);
            flex-shrink: 0;
            color: ${VERDE};
            font-weight: bold;
            text-align: left;
        }

        .cliente {
            max-width: none;
        }

        td > div {
            min-width: 0;
        }

        .acoes {
            justify-content: flex-end;
        }
    }
`;
