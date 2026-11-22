import styled from "styled-components";

export const PaginaContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #F0E6D6;
    padding-bottom: 55px;
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

    @media (max-width: 600px) {
    width: 100%;
    box-sizing: border-box;
    padding: 24px 16px 16px;
    gap: 14px;
    align-items: center;
    flex-wrap: wrap;

    h1 {
        font-size: 1.7rem;
    }
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
        font-size: 18px;
        font-weight: 600;
    }

    .subtitulo {
        font-size: 1.1rem;
        color: gray;
        margin: 0 16px 24px;
        text-align: center;
    }

    .mensagem {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        margin: 24px 16px;
        font-size: 1.1rem;
        color: #2b4b3c;

        a {
            color: #d97713;
            font-weight: 700;
        }
    }

    /* Uma cor por etapa do pedido */
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
        background: #e2e3e5;
        color: #383d41;
    }

.acao-cancelar {
    background: #fde8e8;
    color: #b42318;
    border: 1px solid #f5b5b5;
    border-radius: 6px;
    padding: 7px 12px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: #fbd5d5;
    }
}
`;


export const TabelaDesktop = styled.div`
    width: 100%;

    @media (max-width: 760px) {
        display: none;
    }
`;

export const ListaPedidosMobile = styled.section`
    display: none;
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;

    @media (max-width: 760px) {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    > h2 {
        color: #2b4b3c;
        font-size: 1.2rem;
        margin-bottom: 4px;
    }

    .card-pedido {
        background: #ffffff;
        border: 1px solid #e2d8c8;
        border-radius: 10px;
        padding: 16px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    }

    .card-cabecalho {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 18px;
    }

    .card-cabecalho h3 {
        color: #2b4b3c;
        font-size: 1.05rem;
    }

    .status {
        font-size: 0.78rem;
        padding: 5px 8px;
    }

    .dados-pedido {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px 12px;
    }

    .dado {
        display: flex;
        flex-direction: column;
        gap: 5px;
        min-width: 0;
    }

    .dado span {
        color: #777777;
        font-size: 0.82rem;
    }

    .dado strong {
        color: #333333;
        font-size: 0.92rem;
        overflow-wrap: anywhere;
    }

    .acoes-pedido {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 18px;
        padding-top: 14px;
        border-top: 1px solid #e5e5e5;
    }

    .acoes-pedido button {
        flex: 1;
        min-width: 110px;
        font-size: 0.9rem;
        padding: 10px;
    }
`;
