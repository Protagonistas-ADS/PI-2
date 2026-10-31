import styled from "styled-components";

export const ContainerFormulario = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
    max-width: 450px;
    padding: 35px;

    background-color: #f0e6d5;
    border-radius: 12px;
`;

export const Logo = styled.a`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background-color: #21352B;
    padding: 4px 2px;
    border-radius: 8px;
    margin-bottom: 12px;
    

    
    text-decoration: none;

    img {
        width: 300px;
        height: auto;
        object-fit: contain;
    }
`;
