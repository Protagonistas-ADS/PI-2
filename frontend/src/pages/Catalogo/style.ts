import styled from "styled-components";

export const ContainerPagina = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

export const Conteudo = styled.main`
    flex: 1;
`;

export const SessaoBusca = styled.section`
    background-color: #f0e6d5;
    color: #21352B;
    min-height: 500px;

    display: flex;
    align-items: center;
    padding: 60px 8%;
`;

export const ConteudoBusca = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    max-width: 1100px;
    width: 100%;
    margin: 0 auto;

    h2 {
        font-size: 2.5rem;
        margin: 45px 0;
    }

    p {
        max-width: 750px;
        margin: 0 auto;
        line-height: 1.8;
        color: #21352B;
        letter-spacing: 0.1rem;
        font-size: 1rem;
        font-weight: bold;
    }
`;

export const SessaoProdutos = styled.section`
    padding: 60px 8%;
    background-color: #f2f2f2;
`;

export const BotaoCarrinho = styled.button`
    position: fixed;
    right: 30px;
    top: 140px;
    z-index: 900;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    padding: 16px 24px;

    border: none;
    border-radius: 12px;
    background-color: #ed8b22;
    color: #ffffff;

    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;

    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

    &:hover {
        background-color: #d97713;
        transform: translateY(-2px);
    }

    @media (max-width: 600px) {
        right: 16px;
        bottom: 16px;
        padding: 14px 18px;
    }
`;