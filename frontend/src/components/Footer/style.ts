import styled from "styled-components";

export const Rodape = styled.footer`
    width: 100%;
    padding: 2.5rem 1rem 1rem 0;

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

export const AreaLogo = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

export const SimboloLogo = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    
    width: 2.5rem;
    height: 2.5rem;

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

    color: #ffffffb2;
    font-size: 0.6rem;
    font-weight: bold;
    letter-spacing: 0.1rem;
    text-transform: uppercase;
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

`;

export const LinkContato = styled.a`
    font-size: 1rem;
    line-height: 1.5;
    text-decoration: none;
    font-weight: bold;
    color: #ffffffb2;

    &:hover {
        color: #e8912a;
    }
`;

export const AreaRedesSociais = styled.section`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const ListaRedesSociais = styled.ul`
    display: flex;
    align-items: center;
    gap: 1rem;

    list-style: none;
`;

export const LinkRedeSocial = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 2.5rem;
    height: 2.5rem;

    border: 1px solid #ffffffb2;
    border-radius: 0.3rem;

    color: #ffffff;
    font-size: 1.5rem;
    text-deoration: none;

    transition:
        background-color: 150ms ease,
        color: 150ms ease;

    &:hover {
        background-color: #e8912a;
        color: #2a4a3c;
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