import styled from "styled-components";

// Estilos repetidos nas telas do administrador (Dashboard, Pedidos, Usuários...)

const VERDE = "#2b4b3c";
const LARANJA = "#d97713";

export const CabecalhoPagina = styled.header`
    margin-bottom: 24px;

    h1 {
        color: ${VERDE};
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
    color: ${VERDE};
    line-height: 1.6;

    a {
        color: ${LARANJA};
        font-weight: bold;
    }
`;

// Caixa branca que envolve cada tabela
export const SecaoAdmin = styled.section`
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

    p a {
        color: ${LARANJA};
        font-weight: bold;
    }

    .botoes-topo {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
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

// Botão claro com borda (Atualizar, Limpar filtros, Ver todos os pedidos)
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
    text-decoration: none;
    cursor: pointer;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

// Linha com busca, datas e ordenação
export const BarraBusca = styled.div`
    display: grid;
    grid-template-columns: minmax(220px, 2fr) repeat(3, minmax(140px, 1fr)) auto;
    align-items: end;
    gap: 12px;
    margin-bottom: 16px;

    label {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
        color: ${VERDE};
        font-size: 0.85rem;
        font-weight: bold;
    }

    input,
    select {
        width: 100%;
        min-width: 0;
        padding: 10px 12px;
        border: 1px solid #cbd5ce;
        border-radius: 8px;
        background-color: #ffffff;
        color: #21352b;
        font-family: inherit;
        font-size: 0.95rem;
        font-weight: normal;
    }

    input:focus,
    select:focus {
        outline: 2px solid ${LARANJA};
        outline-offset: 1px;
    }

    &.curta {
        grid-template-columns: minmax(220px, 2fr) minmax(160px, 1fr) auto;
    }

    /* Tablet e celular: busca na linha toda; datas lado a lado; ordenar ao lado de limpar
       (assim os filtros não empurram a lista para baixo da tela) */
    @media (max-width: 1100px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;

        &.curta {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .busca {
            grid-column: 1 / -1;
        }

        > button {
            justify-content: center;
        }
    }

    @media (max-width: 480px) {
        input,
        select {
            padding: 9px 8px;
            font-size: 0.9rem;
        }
    }
`;

// Formulário do painel (registrar movimentação, emitir nota, editar link)
export const FormularioAdmin = styled.form`
    display: flex;
    flex-direction: column;
    gap: 14px;

    .linha {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
        gap: 14px;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
        color: ${VERDE};
        font-size: 0.9rem;
        font-weight: bold;
    }

    input,
    select {
        width: 100%;
        min-width: 0;
        padding: 10px 12px;
        border: 1px solid #cbd5ce;
        border-radius: 8px;
        background-color: #ffffff;
        color: #21352b;
        font-family: inherit;
        font-size: 0.95rem;
        font-weight: normal;
    }

    input:focus,
    select:focus {
        outline: 2px solid ${LARANJA};
        outline-offset: 1px;
    }

    input[aria-invalid="true"] {
        border-color: #c0392b;
    }

    .dica {
        color: #5f6b64;
        font-size: 0.82rem;
        font-weight: normal;
    }

    .erro {
        color: #b02a37;
        font-size: 0.82rem;
        font-weight: bold;
    }

    /* Escolha entre entrada e saída (dois botões que funcionam como opção única) */
    .tipos {
        display: flex;
        gap: 8px;
    }

    .tipos button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        flex: 1;
        padding: 10px 12px;
        border: 1px solid #cbd5ce;
        border-radius: 8px;
        background-color: #ffffff;
        color: ${VERDE};
        font-family: inherit;
        font-size: 0.95rem;
        cursor: pointer;
    }

    .tipos button[aria-pressed="true"].entrada {
        border-color: #1e7b3a;
        background-color: #d4edda;
        color: #155724;
        font-weight: bold;
    }

    .tipos button[aria-pressed="true"].saida {
        border-color: #b02a37;
        background-color: #f8d7da;
        color: #721c24;
        font-weight: bold;
    }

    .acoes-formulario {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        flex-wrap: wrap;
    }

    .acoes-formulario button {
        padding: 11px 18px;
        border-radius: 8px;
        font-family: inherit;
        font-size: 0.95rem;
        cursor: pointer;
    }

    .acoes-formulario button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .botao-principal {
        border: none;
        background-color: ${LARANJA};
        color: #ffffff;
        font-weight: bold;
    }

    .botao-voltar {
        border: 1px solid #cbd5ce;
        background-color: #ffffff;
        color: #4b5b52;
    }

    @media (max-width: 480px) {
        .acoes-formulario button {
            flex: 1;
        }
    }
`;

// Título da janela (modal) com o botão X
export const CabecalhoJanela = styled.header`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 18px;

    h2 {
        color: ${VERDE};
        font-size: 1.4rem;
    }

    p {
        margin-top: 4px;
        color: #5f6b64;
        font-size: 0.9rem;
    }

    button {
        display: flex;
        padding: 4px;
        border: none;
        background: transparent;
        color: #21352b;
        font-size: 1.6rem;
        cursor: pointer;
    }
`;

// "Mostrando 3 de 10 pedidos · R$ 1.050,00"
export const ResumoLista = styled.p`
    margin-bottom: 14px;
    color: #4b5b52;
    font-size: 0.9rem;

    strong {
        color: ${VERDE};
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

export const TabelaAdmin = styled.table`
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

    /* Datas nunca quebram no meio ("21/11/20" + "26") */
    .sem-quebra {
        white-space: nowrap;
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

    .status-entregue {
        background: #d4edda;
        color: #155724;
    }

    .status-cancelado {
        background: #f8d7da;
        color: #721c24;
    }

    .status-administrador {
        background: #e3e9e5;
        color: ${VERDE};
    }

    .status-cliente {
        background: #fff3e3;
        color: #9a4a00;
    }

    .status-emitida,
    .status-entrada {
        background: #d4edda;
        color: #155724;
    }

    .status-cancelada,
    .status-saida {
        background: #f8d7da;
        color: #721c24;
    }

    .status-sem-nota {
        background: #f1f3f2;
        color: #4b5b52;
    }

    /* Quantidade da movimentação: +30 (verde) / −4 (vermelho) */
    .qtd-entrada {
        color: #1e7b3a;
        font-weight: bold;
    }

    .qtd-saida {
        color: #b02a37;
        font-weight: bold;
    }

    .link-pdf {
        color: ${LARANJA};
        font-weight: bold;
        white-space: nowrap;
    }

    .sem-acao {
        color: #6b7280;
        font-size: 0.9rem;
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

    .acao-secundaria {
        border: 1px solid ${VERDE};
        background-color: #ffffff;
        color: ${VERDE};
    }

    /* Telas menores (tablet, notebook pequeno, celular): a tabela não cabe,
       então cada linha vira um cartão, com o nome da coluna ao lado do valor.
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
