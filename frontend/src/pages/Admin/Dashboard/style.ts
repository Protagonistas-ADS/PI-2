import styled from "styled-components";

// Cartões de números do dashboard (a tabela e os filtros ficam em ../style.ts)

const VERDE = "#2b4b3c";

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
