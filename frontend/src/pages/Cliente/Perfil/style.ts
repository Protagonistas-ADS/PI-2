import styled from "styled-components";

export const ContainerPagina = styled.main`
    min-height: 100vh;
    background-color: #F0E6D6;
    display: flex;
    flex-direction: column;
`;

export const CabecalhoPerfil = styled.header`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 30px 2.5%;
    margin-bottom: 20px;

    h1 {
        color: #2b4b3c;
        font-size: 2rem;
    }
`;

export const Conteudo = styled.section`
    width: 95%;
    max-width: 1200px;
    margin: 0 auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 30px 0;
`;

