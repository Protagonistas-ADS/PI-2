import type { ReactNode, SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { ContainerFormulario, Logo, Formulario } from "./style";
import FerrarettoLogo from "../../assets/FerrarettoLogo.png";

interface FormularioGeralProps {
    titulo: string;
    textoLink: string;
    destinoLink: string;
    onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
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

            <h1 style={{margin:"12px 0"}}>{titulo}</h1>

            <Formulario onSubmit={onSubmit}>
                {children}
            </Formulario>

            <Link style={{margin:"10px 0 0", textDecoration:"underline", fontWeight:"bold", color:"#2A4A3C"}} to={destinoLink}>
                {textoLink}
            </Link>
        </ContainerFormulario>
    );
}

export default FormularioGeral;