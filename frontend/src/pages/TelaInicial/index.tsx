import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
    ContainerPagina,
    Conteudo,
    Hero,
    ConteudoHero,
    BotaoOrcamento,
    Laranja
} from "./style";

function TelaInicial() {

    const linksNavegacao = [
        { id: 1, texto: "Inicio", href: "#inicio", ativo: true },
        { id: 2, texto: "Produtos", href: "#produtos", ativo: false },
        { id: 3, texto: "Catálogo", href: "/catalogo", ativo: false },
        { id: 4, texto: "Contato", href: "#contato", ativo: false },
    ];

    return (
        <ContainerPagina>
            <Navbar links={linksNavegacao} />

            <Conteudo>
                <Hero>
                    <ConteudoHero>
                        <h1>Resistência e <Laranja>Qualidade</Laranja> em Paletes de Madeira</h1>

                        <p>
                            Soluções para movimentação e armazenamento de produtos,
                            com qualidade e confiança para sua empresa.
                        </p>

                        <BotaoOrcamento>
                            Entrar em Contato
                        </BotaoOrcamento>
                    </ConteudoHero>
                </Hero>
            </Conteudo>

            <Footer />
        </ContainerPagina>
    );
}

export default TelaInicial;