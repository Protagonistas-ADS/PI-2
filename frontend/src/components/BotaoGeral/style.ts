import styled from "styled-components";
import { Link } from "react-router-dom";

interface BotaoProps {
    width: string;
    height: string;
    $margin?: string | undefined;
    $padding?: string | undefined;
}

export const BotaoAcao = styled.button<BotaoProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    width: ${({ width }) => width};
    height: ${({ height }) => height};

    margin: ${({ $margin }) => $margin};

    padding: ${({ $padding }) => $padding ?? "10px 18px"};
    border: none;
    border-radius: 8px;

    background-color: #d97713;
    color: white;

    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #b56510;
    }
`;

export const BotaoLink = styled(Link)<BotaoProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    width: ${({ width }) => width};
    height: ${({ height }) => height};

    padding: 10px 18px;
    border: none;
    border-radius: 8px;

    background-color: #d97713;
    color: white;

    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #b56510;
    }
`;