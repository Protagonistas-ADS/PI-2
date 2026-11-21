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
    desabilitado?: boolean; // trava o botão (ex.: enquanto envia, para não clicar duas vezes)
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
    desabilitado = false,
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
            disabled={desabilitado}
            aria-busy={desabilitado || undefined}
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