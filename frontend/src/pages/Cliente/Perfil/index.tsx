import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import BotaoGeral from "../../../components/BotaoGeral";
import Navbar from "../../../components/Navbar";
import PainelConta from "../../../components/PainelConta";

import { sairDaConta } from "../../../utils/destinoAposLogin";

import {
    ContainerPagina,
    Conteudo,
    CabecalhoPerfil,
} from "./style";


function Perfil() {
    const navigate = useNavigate();

    function handleLogout() {
        sairDaConta();
        navigate('/login');
    }

    const linksNavegacao = [
        { id: 3, texto: "Catálogo", href: "/catalogo", ativo: false },
        { id: 2, texto: "Meus Pedidos", href: "/clientePedidos", ativo: false },
        { id: 1, texto: "Perfil", href: "/perfil", ativo: true },
        { id: 4, texto: "Sair", href: "/login", ativo: false, aoClicar: handleLogout },
    ];

    return (
        <ContainerPagina>
            <Navbar
                linkLogo="/catalogo"
                links={linksNavegacao}
            />

            <Conteudo>
                <CabecalhoPerfil>
                    <BotaoGeral
                        texto="Voltar"
                        destino="/catalogo"
                        icone={<FaArrowLeft />}
                    />
                    <h1>Meu Perfil</h1>
                </CabecalhoPerfil>

                <PainelConta />
            </Conteudo>
        </ContainerPagina>
    );
}

export default Perfil;
