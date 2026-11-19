
import styled from "styled-components";

export const FundoModal = styled.div`
    position: fixed;
    inset: 0;
    z-index: 1000;

    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;

    background-color: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(6px);
`;

export const ConteudoModal = styled.div`
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 32px;

    background-color: #ffffff;
    border-radius: 20px;
    box-shadow: 0 12px 40px rgba(33, 53, 43, 0.18);

    @media (max-width: 600px) {
        padding: 20px;
        max-height: 95vh;
    }
`;
