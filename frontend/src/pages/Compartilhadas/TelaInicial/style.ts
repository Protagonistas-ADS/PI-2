import styled from "styled-components";
import { Link } from "react-router-dom";

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

    background-color: #F0E6D6;

    color: #2a4a3c;
`;

export const ConteudoHero = styled.div`
    max-width: 650px;

    h1 {
        font-size: clamp(2rem, 5vw, 3.5rem);
        margin-bottom: 20px;
    }

    p {
        font-size: 1.5rem;
        line-height: 1.6;
        letter-spacing: 1px;
        margin-bottom: 30px;
        font-weight: bold;
    }
`;

export const BotaoPrincipal = styled.a`
    display: inline-block;
    padding: 14px 24px;
    background-color: #d97713;
    color: white;
    text-decoration: none;
    font-weight: bold;
    font-size: 1.2rem;
    border-radius: 5px;
    cursor: pointer;

    color: #F0E6D6;

    &:hover {
        background-color: #b56510;
    }
`;

export const SufixoMarca = styled.span`
    color: #d97713;
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

export const CTA = styled.section`
    background-color: #21352B;
    color: #ffffff;
    min-height: 500px;

    display: flex;
    align-items: center;
    padding: 60px 8%;
`;

export const ConteudoCTA = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    max-width: 1100px;
    width: 100%;
    margin: 0 auto;

    h2 {
        font-size: 2.5rem;
        margin-bottom: 20px;
    }

    p {
        max-width: 750px;
        margin: 0 auto 16px;
        line-height: 1.8;
        font-weight: bold;
        color: #f0e6d5;
        font-size: 1.4rem;
    }
`;

export const BotaoCTA = styled(Link)`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

    padding: 14px 24px;
    margin-top: 24px;
    
    background-color: #d97713;
    border-radius: 8px;
    cursor: pointer;
    text-decoration: none;
    color: #F0E6D6;

    font-size: 1.3rem;
    font-weight: bold;

    &:hover {
        background-color: #b56510;
    }
`;
