
import type { ReactNode, MouseEvent } from "react";
import {
    FundoModal,
    ConteudoModal
} from "./style";

interface ModalBaseProps {
    children: ReactNode;
    aoFechar: () => void;
}

function ModalBase({ children, aoFechar }: ModalBaseProps) {
    function impedirFechamento(event: MouseEvent<HTMLDivElement>) {
        event.stopPropagation();
    }

    return (
        <FundoModal onClick={aoFechar}>
            <ConteudoModal onClick={impedirFechamento}>
                {children}
            </ConteudoModal>
        </FundoModal>
    );
}

export default ModalBase;
