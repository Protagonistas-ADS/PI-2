import styled, { css } from "styled-components";
import { NavLink } from "react-router-dom";

// Abaixo desta largura o menu vira gaveta
const CELULAR = "900px";
const LARGURA_MENU = "250px";

export const Estrutura = styled.div`
    min-height: 100vh;
    background-color: #F0E6D6;
`;

// Barra fina do topo: só aparece no celular/tablet
export const BarraTopo = styled.header`
    display: none;

    @media (max-width: ${CELULAR}) {
        position: sticky;
        top: 0;
        z-index: 30;
        display: flex;
        align-items: center;
        gap: 12px;
        height: 60px;
        padding: 0 16px;
        background-color: #2b4b3c;
        color: #fff;

        img {
            height: 36px;
        }

        span {
            font-weight: bold;
            font-size: 1.1rem;
        }
    }
`;

export const BotaoMenu = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #fff;
    font-size: 1.6rem;
    cursor: pointer;

    &:focus-visible {
        outline: 2px solid #e8912a;
    }
`;

// Fundo escuro atrás da gaveta (clicar fecha)
export const Fundo = styled.div`
    display: none;

    @media (max-width: ${CELULAR}) {
        display: block;
        position: fixed;
        inset: 0;
        z-index: 40;
        background: rgba(0, 0, 0, 0.45);
    }
`;

export const MenuLateral = styled.nav<{ $aberto: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 50;
    width: ${LARGURA_MENU};
    display: flex;
    flex-direction: column;
    padding: 20px 14px;
    background-color: #2b4b3c;
    overflow-y: auto;

    @media (max-width: ${CELULAR}) {
        transform: translateX(${({ $aberto }) => ($aberto ? "0" : "-100%")});
        transition: transform 0.25s ease;
        box-shadow: ${({ $aberto }) => ($aberto ? "4px 0 16px rgba(0, 0, 0, 0.25)" : "none")};
    }
`;

export const LogoMenu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding-bottom: 18px;
    margin-bottom: 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    color: #F0E6D6;
    font-size: 0.9rem;

    img {
        height: 64px;
    }
`;

export const ListaMenu = styled.ul`
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
`;

const estiloItemMenu = css`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px 14px;
    border: none;
    border-radius: 10px;
    background: transparent;
    color: #F0E6D6;
    font-family: inherit;
    font-size: 1rem;
    text-decoration: none;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s;

    svg {
        font-size: 1.15rem;
        flex-shrink: 0;
    }

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    &.active {
        background-color: #d97713;
        color: #fff;
        font-weight: bold;
    }

    &:focus-visible {
        outline: 2px solid #e8912a;
    }
`;

// Link do menu (o NavLink marca a tela atual com a classe "active")
export const ItemMenu = styled(NavLink)`${estiloItemMenu}`;

export const BotaoSair = styled.button`${estiloItemMenu}`;

export const RodapeMenu = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-top: 14px;
    margin-top: 14px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
`;

export const AreaConteudo = styled.main`
    margin-left: ${LARGURA_MENU};
    padding: 32px;
    min-width: 0;

    @media (max-width: ${CELULAR}) {
        margin-left: 0;
        padding: 20px 16px;
    }
`;
