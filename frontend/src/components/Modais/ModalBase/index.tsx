
import type { ReactNode, MouseEvent } from "react";
import {
    FundoModal,
    ConteudoModal
} from "./style";

interface ModalBaseProps {
    children: ReactNode;
    aoFechar: () => void;
    larguraMaxima?: number; // em px (padrão 900; formulários curtos usam menos)
}

function ModalBase({ children, aoFechar, larguraMaxima = 900 }: ModalBaseProps) {
    function impedirFechamento(event: MouseEvent<HTMLDivElement>) {
        event.stopPropagation();
    }

    return (
        <FundoModal onClick={aoFechar}>
            <ConteudoModal onClick={impedirFechamento} $larguraMaxima={larguraMaxima}>
                {children}
            </ConteudoModal>
        </FundoModal>
    );
}

export default ModalBase;
