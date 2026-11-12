import type { ReactNode } from "react";
import { BotaoLink, BotaoAcao } from "./style";

interface BotaoGeralProps {
    texto?: string;
    destino?: string;
    icone?: ReactNode;
    onClick?: () => void;
    width?: string;
    height?: string;
    type?: "button" | "submit";
    margin?: string;
    padding?: string;
}

function BotaoGeral({
    texto,
    destino,
    icone,
    onClick,
    width = "fit-content",
    height = "auto",
    type = "button",
    margin,
    padding,
}: BotaoGeralProps) {

    if (destino) {
        return (
            <BotaoLink 
                to={destino} 
                width={width} 
                height={height}
                $margin={margin}
                $padding={padding}
            >
                {icone}
                {texto}
            </BotaoLink>
        );
    }

    return (
        <BotaoAcao
            type={type}
            onClick={onClick}
            width={width}
            height={height}
            $margin={margin}
            $padding={padding}
        >
            {icone}
            {texto}
        </BotaoAcao>
    );
}

export default BotaoGeral;