import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ContainerFormulario, Logo } from "./style";
import FerrarettoLogo from "../../assets/FerrarettoLogo.png";

interface FormularioGeralProps {
    titulo: string;
    textoLink: string;
    destinoLink: string;
    onSubmit: () => void;
    children: ReactNode;
}

function FormularioGeral({
    titulo,
    textoLink,
    destinoLink,
    onSubmit,
    children
}: FormularioGeralProps) {
    return (
        <ContainerFormulario>
            <Logo>
                <img src={FerrarettoLogo} alt="Logo da empresa" />
            </Logo>

            <h2>{titulo}</h2>

            <form onSubmit={onSubmit}>
                {children}
            </form>

            <Link to={destinoLink}>
                {textoLink}
            </Link>
        </ContainerFormulario>
    );
}

export default FormularioGeral;