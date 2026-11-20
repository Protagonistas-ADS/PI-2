
import styled from "styled-components";

export const CabecalhoCarrinho = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    h2 {
        margin: 0;
        color: #2b4b3c;
        font-size: 1.8rem;
    }

    button {
        display: flex;
        align-items: center;
        border: none;
        background: transparent;
        color: #21352b;
        font-size: 1.8rem;
        cursor: pointer;
    }
`;

export const ListaProdutos = styled.section`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const ItemProduto = styled.article`
    padding: 18px;
    border: 1px solid #e0e6e1;
    border-radius: 12px;
    background-color: #f8faf8;

    h3 {
        margin: 0 0 12px;
        color: #2b4b3c;
        font-size: 1.2rem;
    }

    p {
        margin: 6px 0;
        color: #5d6d63;
    }

    strong {
        display: block;
        margin-top: 10px;
        color: #ed8b22;
    }

    .controle-quantidade {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-top: 14px;
        flex-wrap: wrap;

        > span {
            color: #5d6d63;
            font-size: 0.95rem;
        }
    }

    .botoes-quantidade {
        display: flex;
        align-items: center;
        gap: 12px;

        span {
            min-width: 24px;
            text-align: center;
            font-weight: 600;
            color: #2b4b3c;
        }

        button {
            display: flex;
            align-items: center;
            justify-content: center;

            width: 34px;
            height: 34px;

            border: none;
            border-radius: 8px;

            background-color: #2b4b3c;
            color: #ffffff;

            cursor: pointer;
            transition: 0.2s;

            &:hover:not(:disabled) {
                background-color: #21352b;
                transform: translateY(-1px);
            }

            &:disabled {
                background-color: #aab5ae;
                cursor: not-allowed;
                opacity: 0.6;
            }
        }
    }

    .botao-remover {
        display: flex;
        align-items: center;
        gap: 6px;

        border: none;
        background: transparent;
        color: #d64545;

        font-size: 0.9rem;
        font-weight: 600;

        cursor: pointer;

        &:hover {
            color: #a92d2d;
            text-decoration: underline;
        }
    }
`;

export const ResumoCarrinho = styled.footer`
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #e0e6e1;

    strong {
        color: #2b4b3c;
        font-size: 1.3rem;
    }
`;

export const AcoesCarrinho = styled.div`
    display: flex;
    gap: 12px;

    button {
        flex: 1;
        padding: 14px;
        border: none;
        border-radius: 10px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
    }

    .acao-pedido {
        background-color: #ed8b22;
        color: #ffffff;

        &:hover {
            background-color: #d97713;
        }
    }

    @media (max-width: 500px) {
        flex-direction: column;
    }
`;
