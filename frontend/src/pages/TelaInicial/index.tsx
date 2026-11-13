import { FaAward, FaHeadset, FaLeaf } from "react-icons/fa";
import { LuArrowRight } from "react-icons/lu";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
    ContainerPagina,
    Conteudo,
    Hero,
    ConteudoHero,
    BotaoOrcamento,
    SufixoMarca,
    Sobre,
    ConteudoSobre,
    Cards,
    Card,
    CTA,
    ConteudoCTA,
    BotaoCTA,
} from "./style";


function TelaInicial() {

    const linksNavegacao = [
        { id: 4, texto: "Entrar", href: "/login", ativo: false },
        { id: 5, texto: "Criar Conta", href: "/cadastro", ativo: false },
        { id: 3, texto: "Contatos", href: "#contatos", ativo: false },
    ];

    return (
        <ContainerPagina>
            <Navbar linkLogo="/" links={linksNavegacao} />

            <Conteudo>
                <Hero>
                    <ConteudoHero>
                        <h1>Resistência e <SufixoMarca>Qualidade</SufixoMarca> em Paletes de Madeira</h1>

                        <p>
                            Soluções para movimentação e armazenamento de produtos,
                            com qualidade e confiança para sua empresa.
                        </p>

                        <BotaoOrcamento href="/cadastro">
                            Fazer Cadastro
                        </BotaoOrcamento>
                    </ConteudoHero>
                </Hero>

                <Sobre>
                    <ConteudoSobre>
                        <h2>Conheça a S.<SufixoMarca>FERRARETTO</SufixoMarca></h2>

                        <p>
                            Trabalhamos com paletes de madeira para atender às necessidades de armazenamento e movimentação de produtos da sua empresa.
                        </p>

                        <p>
                            Buscamos oferecer soluções práticas, resistentes e adequadas para a rotina de cada cliente.
                        </p>

                        <Cards>
                            <Card>
                                <FaAward size={32} style={{ marginBottom: "24px" }}/>
                                <h3>Madeira de Qualidade</h3>
                                <p>Paletes resistentes e duráveis</p>
                            </Card>
                            <Card>
                                <FaLeaf size={32} style={{ marginBottom: "24px" }}/>
                                <h3>Sustentabilidade</h3>
                                <p>Reutilizamos e valorizamos a madeira</p>
                            </Card>
                            <Card>
                                <FaHeadset size={32} style={{ marginBottom: "24px" }}/>
                                <h3>Atendimento de Qualidade</h3>
                                <p>Tire todas as suas dúvidas com a gente</p>
                            </Card>
                        </Cards>
                    </ConteudoSobre>
                </Sobre>

                <CTA>
                    <ConteudoCTA>
                        <h2>Pronto para transformar seus projetos?</h2>

                        <p>Conheça nossa linha completa de paletes de madeira e encontre a solução ideal para o seu negócio.</p>

                        <BotaoCTA to="/login">
                            Explorar Catálogo
                            <LuArrowRight />
                        </BotaoCTA>
                    </ConteudoCTA>
                </CTA>
            </Conteudo>

            <Footer linkLogo="/" />
        </ContainerPagina>
    );
}

export default TelaInicial;