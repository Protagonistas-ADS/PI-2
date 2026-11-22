import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

import fotoGalpao from "../../../assets/empresa/banner-galpao.webp";
import fotoFachada from "../../../assets/empresa/fachada-empresa.webp";

// Cores da marca (as mesmas do menu, do rodapé e do catálogo).
const cores = {
    verde: "#2a4a3c",
    verdeEscuro: "#21352b",
    laranja: "#d97713",
    laranjaEscuro: "#b56510",
    creme: "#f0e6d6",
    cremeClaro: "#faf6ef",
    texto: "#26332c",
    textoSuave: "#5b6b63",
};

export const ContainerPagina = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

export const Conteudo = styled.main`
    flex: 1;
    color: ${cores.texto};
`;

/* ---------- Topo ---------- */

export const Hero = styled.section`
    display: flex;
    align-items: center;
    min-height: 560px;
    padding: 80px 8%;

    background:
        linear-gradient(90deg, rgba(20, 36, 28, 0.92) 0%, rgba(20, 36, 28, 0.75) 50%, rgba(20, 36, 28, 0.35) 100%),
        url(${fotoGalpao}) center / cover no-repeat;
    color: #ffffff;

    @media (max-width: 768px) {
        min-height: auto;
        padding: 56px 16px;
        background:
            linear-gradient(rgba(20, 36, 28, 0.85), rgba(20, 36, 28, 0.85)),
            url(${fotoGalpao}) center / cover no-repeat;
    }
`;

export const ConteudoHero = styled.div`
    max-width: 640px;

    h1 {
        font-size: clamp(2rem, 4.5vw, 3.2rem);
        line-height: 1.15;
        margin: 18px 0;
    }

    > p {
        font-size: 1.15rem;
        line-height: 1.7;
        color: #e8e2d6;
        margin-bottom: 32px;
    }
`;

export const Selo = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;

    background-color: rgba(217, 119, 19, 0.18);
    border: 1px solid rgba(217, 119, 19, 0.6);
    border-radius: 999px;
    color: #ffd2a1;
    font-size: 0.9rem;
`;

export const Botoes = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 14px;

    @media (max-width: 480px) {
        flex-direction: column;
    }
`;

const estiloBotao = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 14px 26px;

    border-radius: 8px;
    font-size: 1.05rem;
    font-weight: bold;
    text-decoration: none;
    transition: background-color 0.2s, color 0.2s;
`;

export const BotaoPrincipal = styled(Link)`
    ${estiloBotao}
    background-color: ${cores.laranja};
    color: #ffffff;

    &:hover {
        background-color: ${cores.laranjaEscuro};
    }
`;

export const BotaoSecundario = styled.a`
    ${estiloBotao}
    border: 2px solid #ffffff;
    color: #ffffff;

    &:hover {
        background-color: #ffffff;
        color: ${cores.verde};
    }
`;

export const ListaConfianca = styled.ul`
    display: flex;
    flex-wrap: wrap;
    gap: 10px 24px;
    margin-top: 32px;
    list-style: none;

    li {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #e8e2d6;
        font-size: 0.95rem;
    }

    svg {
        color: ${cores.laranja};
        flex-shrink: 0;
    }
`;

/* ---------- Seções ---------- */

interface SecaoProps {
    $fundo?: "claro" | "escuro";
}

export const Secao = styled.section<SecaoProps>`
    padding: 80px 8%;
    scroll-margin-top: 90px;

    background: ${({ $fundo }) =>
        $fundo === "escuro"
            ? `
                linear-gradient(
                    90deg,
                    rgba(20, 36, 28, 0.93),
                    rgba(20, 36, 28, 0.78)
                ),
                url(${fotoFachada}) center / cover no-repeat
            `
            : $fundo === "claro"
                ? cores.cremeClaro
                : "#ffffff"};

    color: ${({ $fundo }) => ($fundo === "escuro" ? cores.creme : cores.texto)};

    @media (max-width: 768px) {
        padding: 56px 16px;

        background-position: center;
    }
`;

export const ConteudoSecao = styled.div`
    max-width: 1100px;
    margin: 0 auto;
`;

export const CabecalhoSecao = styled.div`
    text-align: center;
    margin-bottom: 40px;

    h2 {
        font-size: clamp(1.6rem, 3vw, 2.1rem);
        color: ${cores.verde};
        margin-bottom: 10px;
    }

    p {
        color: ${cores.textoSuave};
        line-height: 1.6;
    }
`;

/* ---------- Produtos ---------- */

export const GradeProdutos = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;

    @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 520px) {
        grid-template-columns: 1fr;
    }
`;

export const CardProduto = styled(Link)`
    display: flex;
    flex-direction: column;
    overflow: hidden;

    background-color: #ffffff;
    border: 1px solid #e6dfd2;
    border-radius: 10px;
    color: inherit;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
    }

    img {
        width: 100%;
        aspect-ratio: 4 / 3;
        object-fit: cover;
        background-color: ${cores.creme};
    }

    div {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 8px;
        padding: 18px;
    }

    h3 {
        font-size: 1.1rem;
        color: ${cores.verde};
    }

    p {
        flex: 1;
        color: ${cores.textoSuave};
        font-size: 0.95rem;
        line-height: 1.5;
    }

    strong {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        column-gap: 4px;
        color: ${cores.laranja};
        font-size: 1.2rem;
        white-space: nowrap;
    }

    span {
        color: ${cores.textoSuave};
        font-size: 0.85rem;
        font-weight: normal;
    }
`;

export const AvisoProdutos = styled.p`
    padding: 24px;
    text-align: center;
    color: ${cores.textoSuave};
    background-color: ${cores.cremeClaro};
    border-radius: 10px;
`;

export const LinkCentral = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: fit-content;
    margin: 36px auto 0;

    color: ${cores.laranja};
    font-weight: bold;
    text-decoration: none;

    &:hover {
        color: ${cores.laranjaEscuro};
        text-decoration: underline;
    }
`;

/* ---------- Como funciona ---------- */

export const Passos = styled.ol`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    list-style: none;

    @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 560px) {
        grid-template-columns: 1fr;
    }
`;

export const Passo = styled.li`
    position: relative;
    padding: 28px 22px;

    background-color: #ffffff;
    border: 1px solid #e6dfd2;
    border-radius: 10px;

    > svg {
        font-size: 1.8rem;
        color: ${cores.verde};
        margin-bottom: 14px;
    }

    h3 {
        font-size: 1.05rem;
        color: ${cores.verde};
        margin-bottom: 8px;
    }

    p {
        color: ${cores.textoSuave};
        font-size: 0.95rem;
        line-height: 1.6;
    }
`;

export const NumeroPasso = styled.span`
    position: absolute;
    top: 18px;
    right: 18px;

    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;

    background-color: ${cores.laranja};
    border-radius: 50%;
    color: #ffffff;
    font-weight: bold;
    font-size: 0.9rem;
`;

/* ---------- Sobre ---------- */

export const GradeSobre = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: center;

    @media (max-width: 860px) {
        grid-template-columns: 1fr;
        gap: 32px;
    }
`;

export const TextoSobre = styled.div`
    h2 {
        font-size: clamp(1.6rem, 3vw, 2.1rem);
        margin-bottom: 18px;
        color: #ffffff;
    }

    p {
        line-height: 1.8;
        margin-bottom: 14px;
        color: ${cores.creme};
    }
`;

export const Diferenciais = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 16px;
    list-style: none;
`;

export const Diferencial = styled.li`
    display: flex;
    gap: 16px;
    padding: 20px;

    background-color: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(240, 230, 214, 0.15);
    border-radius: 10px;

    > svg {
        font-size: 1.6rem;
        color: ${cores.laranja};
        flex-shrink: 0;
        margin-top: 2px;
    }

    h3 {
        font-size: 1.05rem;
        color: #ffffff;
        margin-bottom: 6px;
    }

    p {
        color: #d8d0c2;
        line-height: 1.6;
        font-size: 0.95rem;
    }
`;
export const ColunaSobre = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

export const ImagemFachada = styled.img`
    width: 100%;
    height: 220px;
    object-fit: cover;
    object-position: center 55%;
    border-radius: 10px;
    border: 1px solid rgba(240, 230, 214, 0.2);
`;
/* ---------- Onde estamos ---------- */

export const GradeContato = styled.div`
    display: grid;
    grid-template-columns: 1fr 1.3fr;
    gap: 32px;
    align-items: stretch;

    @media (max-width: 860px) {
        grid-template-columns: 1fr;
    }
`;

export const ListaContato = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 20px;
    list-style: none;

    li {
        display: flex;
        gap: 14px;
    }

    li > svg {
        font-size: 1.3rem;
        color: ${cores.laranja};
        flex-shrink: 0;
        margin-top: 2px;
    }

    div {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
    }

    strong {
        color: ${cores.verde};
    }

    a,
    span {
        color: ${cores.textoSuave};
        line-height: 1.5;
        overflow-wrap: anywhere;
    }

    a:hover {
        color: ${cores.laranja};
    }
`;

export const Mapa = styled.iframe`
    width: 100%;
    min-height: 340px;
    border: 0;
    border-radius: 10px;
    background-color: ${cores.creme};
`;
