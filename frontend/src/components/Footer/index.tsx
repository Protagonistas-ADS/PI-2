import { 
    FaInstagram, 
    FaFacebookF, 
    FaWhatsapp, 
} from "react-icons/fa";
import {
    FiPhone,
    FiMail,
    FiMapPin,
} from "react-icons/fi";
import {
    Rodape,
    ConteudoRodape,
    AreaLogo,
    SimboloLogo,
    IdentificacaoMarca,
    NomeMarca,
    SufixoMarca,
    DescricaoMarca,
    AreaContato,
    TituloArea,
    ListaContato,
    ItemContato,
    LinkContato,
    AreaRedesSociais,
    ListaRedesSociais,
    LinkRedeSocial,
    RodapeInferior,
} from "./style";

function Footer() {
    return (
        <Rodape>
            <ConteudoRodape id="contatos">

                <AreaLogo>
                    <SimboloLogo>S.F</SimboloLogo>

                    <IdentificacaoMarca>
                        <NomeMarca>
                            S.<SufixoMarca>FERRARETTO</SufixoMarca>
                        </NomeMarca>

                        <DescricaoMarca>Paletes de Madeira</DescricaoMarca>
                    </IdentificacaoMarca>
                </AreaLogo>

                <AreaContato>
                    <TituloArea>Contato</TituloArea>

                    <ListaContato>

                        <ItemContato>
                            <FiPhone />
                            <LinkContato>
                                (11) 12345-6789
                            </LinkContato>
                        </ItemContato>

                        <ItemContato>
                            <FiMail />
                            <LinkContato 
                                href="https://mail.google.com"
                                target="_blank"
                            >
                                contato@gmail.com.br
                            </LinkContato>
                        </ItemContato>

                        <ItemContato>
                            <FiMapPin />
                            <LinkContato
                                href="https://www.google.com/maps"
                                target="_blank"
                            >
                                R. JOSÉ DE ALENCAR, SALTO-SP
                            </LinkContato>
                        </ItemContato>
                    </ListaContato>
                </AreaContato>

                <AreaRedesSociais>
                    <TituloArea>Redes Sociais</TituloArea>

                    <ListaRedesSociais>
                        <li>
                            <LinkRedeSocial
                                href="https://www.instagram.com"
                                target="_blank"
                            >
                                <FaInstagram />
                            </LinkRedeSocial>
                        </li>

                        <li>
                            <LinkRedeSocial
                                href="https://www.facebook.com"
                                target="_blank"
                            >
                                <FaFacebookF />
                            </LinkRedeSocial>
                        </li>

                        <li>
                            <LinkRedeSocial
                                href="https://web.whatsapp.com"
                                target="_blank"
                            >
                                <FaWhatsapp />
                            </LinkRedeSocial>
                        </li>
                    </ListaRedesSociais>
                </AreaRedesSociais>
            </ConteudoRodape>

            <RodapeInferior>
                &copy; 2026 S.FERRARETTO. Todos os direitos reservados
            </RodapeInferior>
        </Rodape>
    );
}

export default Footer;