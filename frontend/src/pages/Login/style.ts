import styled from "styled-components";

export const ContainerPagina = styled.main`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    padding: 30px;

    background: linear-gradient(
        to bottom,
        #2A4A3C,
        #21352B
    );
`;

export const ContainerVoltar = styled.div`
    position: absolute;
    top: 25px;
    left: 25px;
`;