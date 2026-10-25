import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
    ContainerPagina,
    Conteudo,
    SessaoBusca,
    ConteudoBusca
} from "./style";
function Catalogo() {


    const linksNavegacao = [
        { id: 1, texto: "Catálogo", href: "/catalogo", ativo: true },
        { id: 3, texto: "Home", href: "/", ativo: false },
        { id: 4, texto: "Contatos", href: "#contatos", ativo: false },
    ];


    return (
        <ContainerPagina>
            <Navbar links={linksNavegacao} />

            <Conteudo>
                <SessaoBusca>
                    <ConteudoBusca>
                        <p>TODOS OS PRODUTOS</p>

                        <h2>Catálogo Completo</h2>

                        <p>Explore nossa linha completa de paletes de madeira</p>
                    </ConteudoBusca>
                </SessaoBusca>
            </Conteudo>

            <Footer />
        </ContainerPagina>
    )
}

export default Catalogo;