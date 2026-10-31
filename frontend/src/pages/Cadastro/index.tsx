import { ContainerPagina } from "./style";
import BotaoGeral from "../../components/BotaoGeral"
import { FaArrowLeft } from "react-icons/fa";

function Cadastro() {
    return (
        <ContainerPagina>
            <BotaoGeral
                texto="Voltar"
                type="button"
                icone={<FaArrowLeft/>}
            />
            <h1>CADASTRO</h1>
        </ContainerPagina>
    );
}

export default Cadastro;