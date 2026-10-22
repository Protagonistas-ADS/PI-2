import styled from "styled-components";

interface MenuProps {
    $menuAberto: boolean;
}

interface LinkProps {
    $ativo: boolean;
}


export const Cabecalho = styled.header`
    position: sticky;
    top: 0;
    z-index: 100;

    width: 100%;
    padding: 1rem 0;

    background-color: #2a4a3c;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const ConteudoCabecalho = styled.div`
    position: relative;

    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;

    @media (width >= 768px) {
        padding: 0 1.5rem;
    }
`;

export const Logo = styled.a`
    display: flex;
    align-items: center;
    gap: 0.6rem;

    
    text-decoration: none;
`;

export const SimboloLogo = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 2.5rem;
    height: 2.5rem;
    flex-shrink: 0;

    border-radius: 0.3rem;
    background-color: #e8912a;
    color: #2a4a3c;

    font-size: 1.4rem;
    font-weight: bold;
    font-family: "montserrat";
`;

export const IdentificacaoMarca = styled.div`
    display: flex;
    flex-direction: column;
`;

export const NomeMarca = styled.span`
    color: #ffffff;
    font-size: 1.5rem;
    font-weight: bold;
`;

export const SufixoMarca = styled.span`
    color: #e8912a;
`;

export const DescricaoMarca = styled.span`
    margin-top: 0.2rem;

    color: rgba(255, 255, 255, 0.7);
    font-size: 0.6rem;
    font-weight: bold;
    letter-spacing: 0.1em;
    text-transform: uppercase;
`;

export const BotaoMenu = styled.button`
    padding: 0.5rem;
    border: none;
    background: transparent;
    cursor: pointer;

    @media (width >= 768px) {
        display: none;
    }
`;

export const Navegacao = styled.nav<MenuProps>`
    display: ${({ $menuAberto }) =>
        $menuAberto ? "block" : "none"
    };

    position: absolute;
    top: calc(100% + 1.1rem);
    left: 0;
    right: 0;

    padding: 1.5rem 1rem;

    background-color: #2a4a3c;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);

    @media (width >= 768px) {
        display: block;

        position: static;
        padding: 0;

        border: none;
        box-shadow: none;
        background-color: transparent;
    }
`;

export const ListaLinks = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;

    margin: 0;
    padding: 0;
    list-style: none;

    @media (width >= 768px) {
        flex-direction: row;
        gap: 2rem;
    }
`;

export const ItemLink = styled.a<LinkProps>`
    padding: 0.25rem 0;

    color: #ffffff;
    font-size: 1rem;
    font-weight: bold;
    text-decoration: none;

    border-bottom: 2px solid
        ${({ $ativo }) => $ativo ? "#e8912a" : "transparent"};

    &:hover {
        border-bottom-color: #e8912a;
    }
`;
