import styled from "styled-components";

// Cores do site: verde #2b4b3c, laranja #ed8b22 (hover #d97713), bege #f0e6d6

export const ContainerPagina = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f2f2f2;
`;

export const Conteudo = styled.main`
    flex: 1;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 16px 60px;

    .botao-principal {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 14px 20px;
        border: none;
        border-radius: 10px;
        background-color: #ed8b22;
        color: #ffffff;
        font-size: 1rem;
        font-weight: 700;
        text-decoration: none;
        cursor: pointer;

        &:hover:not(:disabled) {
            background-color: #d97713;
        }

        &:disabled {
            opacity: 0.6;
            cursor: wait;
        }
    }
`;

export const Cabecalho = styled.header`
    margin-bottom: 28px;
    color: #21352b;

    .voltar {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #2b4b3c;
        font-weight: 600;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }

    h1 {
        margin: 16px 0 6px;
        font-size: 2rem;
        color: #2b4b3c;
    }

    p {
        color: #555;
    }
`;

export const Grade = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 24px;
    align-items: start;

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

export const ListaItens = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
`;

export const Item = styled.li`
    display: grid;
    grid-template-columns: 88px minmax(0, 1fr) auto auto;
    grid-template-areas:
        "foto info quantidade subtotal"
        "foto info remover remover";
    align-items: center;
    gap: 8px 20px;
    padding: 16px;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    img {
        grid-area: foto;
        width: 88px;
        height: 88px;
        object-fit: cover;
        border-radius: 8px;
        background: #f0e6d6;
    }

    .info {
        grid-area: info;
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;

        h3 {
            margin: 0;
            font-size: 1.1rem;
            color: #21352b;
        }

        .preco-unitario {
            color: #333;
        }
    }

    .quantidade {
        grid-area: quantidade;
        display: flex;
        align-items: center;
        gap: 10px;

        span {
            min-width: 32px;
            text-align: center;
            font-weight: 700;
        }

        button {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            width: 34px;
            height: 34px;
            padding: 0;
            border: 1px solid #2b4b3c;
            border-radius: 8px;
            background: #e8f0eb;
            color: #2b4b3c;
            cursor: pointer;

            &:disabled {
                opacity: 0.4;
                cursor: not-allowed;
            }
        }
    }

    .subtotal {
        grid-area: subtotal;
        min-width: 110px;
        text-align: right;
        font-size: 1.1rem;
        color: #2b4b3c;
    }

    .remover {
        grid-area: remover;
        justify-self: end;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border: none;
        background: none;
        color: #b42318;
        font-weight: 600;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }

    @media (max-width: 600px) {
        grid-template-columns: 72px minmax(0, 1fr);
        grid-template-areas:
            "foto info"
            "quantidade subtotal"
            "remover remover";

        img {
            width: 72px;
            height: 72px;
        }
    }
`;

export const Resumo = styled.form`
    position: sticky;
    top: 110px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 24px;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    h2 {
        margin: 0 0 8px;
        font-size: 1.3rem;
        color: #2b4b3c;
    }

    .linha {
        display: flex;
        justify-content: space-between;
        color: #333;
    }

    .total {
        padding: 10px 0 14px;
        border-bottom: 1px solid #e5e5e5;
        font-size: 1.25rem;
        font-weight: 700;
        color: #21352b;
    }

    label {
        margin-top: 8px;
        font-weight: 600;
        color: #21352b;

        small {
            font-weight: 400;
            color: #777;
        }
    }

    input,
    textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #c9c9c9;
        border-radius: 8px;
        font: inherit;
        resize: vertical;

        &:focus {
            outline: 2px solid #ed8b22;
            border-color: transparent;
        }
    }

    .contador {
        align-self: flex-end;
        color: #777;
    }

    .info-retirada,
    .aviso {
        margin: 4px 0 8px;
        font-size: 0.9rem;
        line-height: 1.5;
        color: #555;
    }

    .aviso {
        padding: 12px;
        border-radius: 8px;
        background: #fff3cd;
        color: #856404;
    }

    @media (max-width: 900px) {
        position: static;
    }
`;

export const CarrinhoVazio = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    max-width: 420px;
    margin: 40px auto;
    padding: 40px 24px;
    border-radius: 12px;
    background: #ffffff;
    color: #2b4b3c;
    text-align: center;

    h2 {
        margin: 0;
    }

    p {
        color: #555;
        margin-bottom: 8px;
    }
`;
