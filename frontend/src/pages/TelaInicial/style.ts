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

export const Laranja = styled.span`
    color: #e8912a;
`;