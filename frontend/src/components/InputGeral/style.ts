import styled from "styled-components";

export const CampoInput = styled.input`
    width: 240px;
    height: 45px;
    padding: 10px 12px;
    margin: 5px 8px;

    background-color: #ffffff;
    border: 1px solid #c9c9c9;
    border-radius: 5px;

    font-size: 15px;
    color: #333333;

    outline: none;

    &::placeholder {
        color: #999999;
    }
`;