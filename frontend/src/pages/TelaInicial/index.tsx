import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ContainerPagina, Conteudo } from "./style";

function TelaInicial() {

    const linksNavegacao = [
        { id: 1, texto: "Inicio", href: "#inicio", ativo: true },
        { id: 2, texto: "Produtos", href: "#produtos", ativo: false },
        { id: 3, texto: "Catálogo", href: "/catalogo", ativo: false},
        { id: 4, texto: "Contato", href: "#contato", ativo: false},
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