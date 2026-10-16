import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ContainerPagina, Conteudo } from "./style";

function TelaInicial() {

    const linksNavegacao = [
        { texto: "Inicio", href: "#inicio", ativo: true },
        { texto: "Produtos", href: "#produtos", ativo: false },
        { texto: "Catálogo", href: "/catalogo", ativo: false},
        { texto: "Contato", href: "#contato", ativo: false},
    ];

    return (
        <ContainerPagina>
            <Navbar links={linksNavegacao} />

        <Conteudo>
            
        </Conteudo>

            <Footer />
        </ContainerPagina>
    );
}

export default TelaInicial;