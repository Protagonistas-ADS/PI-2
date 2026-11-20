import styled from "styled-components";
import { Link } from "react-router-dom";

export const Rodape = styled.footer`
    width: 100%;
    padding: 2.5rem 1rem 1rem;

    background-color: #2a4a3c;
    color: #ffffff;
`;

export const ConteudoRodape = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;

    width: 100%;
    max-width: 1200px;
    margin: 0 auto;

    @media (width >= 768px) {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        gap: 2rem;
        padding: 1rem 2rem;
    }
`;

export const AreaContato = styled.section`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const TituloArea = styled.h2`
    color: #e8912a;
    font-size: 1.2rem;
    font-weight: bold;
`;

export const ListaContato = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    list-style: none;
`;

export const ItemContato = styled.li`
    display: flex;
    align-items: flex-start;
    gap: 1rem;

    color: #ffffffb2;

    svg {
        flex-shrink: 0;
        margin-top: 0.25rem;
    }
`;

export const LinkContato = styled.a`
    font-size: 1rem;
    line-height: 1.5;
    text-decoration: none;
    font-weight: bold;
    color: #ffffffb2;
    overflow-wrap: anywhere;

    &:hover {
        color: #e8912a;
    }
`;

export const TextoContato = styled.p`
    font-size: 1rem;
    line-height: 1.5;
    font-weight: bold;
    color: #ffffffb2;
`;

export const BotaoWhatsapp = styled.a`
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    align-self: flex-start;

    padding: 0.7rem 1.2rem;
    border-radius: 0.4rem;

    background-color: #25d366;
    color: #ffffff;
    font-size: 1rem;
    font-weight: bold;
    text-decoration: none;

    transition: background-color 150ms ease;

    svg {
        font-size: 1.3rem;
    }

    &:hover {
        background-color: #1ebe5a;
    }
`;

export const RodapeInferior = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 2rem auto;
    padding: 1rem 0;

    border-top: 1px solid #ffffffb2;

    color: #ffffffb2;
    font-size: 1rem;
    line-height: 1.5;
    text-align: center;
`;

export const Logo = styled(Link)`
    display: flex;
    align-items: center;
    gap: 0.6rem;

    text-decoration: none;

    img {
        width: 300px;
        max-width: 100%;
        height: auto;
        object-fit: contain;
    }
`;
