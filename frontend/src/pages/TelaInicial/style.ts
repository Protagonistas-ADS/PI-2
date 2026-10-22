import styled from "styled-components";

export const ContainerPagina = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

export const Conteudo = styled.main`
    flex: 1;
`;

export const Hero = styled.section`
    min-height: 500px;
    display: flex;
    align-items: center;
    padding: 60px;

    background-image:
        linear-gradient(
            to right,
            rgba(32, 48, 41, 0.9),
            #ada79f
        );

    color: white;
`;

export const ConteudoHero = styled.div`
    max-width: 650px;

    h1 {
        font-size: clamp(2rem, 5vw, 3.5rem);
        margin-bottom: 20px;
    }

    p {
        font-size: 1.1rem;
        line-height: 1.6;
        letter-spacing: 1.2px;
        margin-bottom: 30px;
        font-weight: bold;
    }
`;

export const BotaoOrcamento = styled.a`
    display: inline-block;
    padding: 14px 24px;
    background-color: #e8912a;
    color: white;
    text-decoration: none;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: #cf7717;
    }
`;

export const SufixoMarca = styled.span`
    color: #e8912a;
`;


export const Sobre = styled.section`
    padding: 70px 8%;
    background-color: #2a4a3c;
    color: #f0e6d5;
`;

export const ConteudoSobre = styled.div`
    max-width: 1100px;
    margin: 0 auto;
    text-align: center;

    h2 {
        font-size: 2rem;
        margin-bottom: 20px;
    }

    p {
        max-width: 750px;
        margin: 0 auto 16px;
        line-height: 1.8;
        font-weight: bold;
    }
`;

export const Cards = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    margin-top: 40px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 20px;
    }
`;

export const Card = styled.div`
    padding: 30px 24px;
    background-color: #f0e6d5;
    color: #2a4a3c;
    border-radius: 8px;

    h3 {
        font-size: 1.15rem;
        margin-bottom: 12px;
    }

    p {
        color: #5b6b63;
        line-height: 1.6;
        margin: 0;
    }
`;
