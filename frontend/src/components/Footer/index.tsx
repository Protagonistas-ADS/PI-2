import { FaWhatsapp } from "react-icons/fa";
import { FiMail, FiMapPin, FiFileText } from "react-icons/fi";
import {
    Rodape,
    ConteudoRodape,
    AreaContato,
    TituloArea,
    ListaContato,
    ItemContato,
    LinkContato,
    TextoContato,
    BotaoWhatsapp,
    RodapeInferior,
    Logo
} from "./style";
import FerrarettoLogo from "../../assets/FerrarettoLogo.png";
import { dadosEmpresa } from "../../utils/dadosEmpresa";

interface FooterProps {
    linkLogo: string;
}

function Footer({ linkLogo }: FooterProps) {
    const anoAtual = new Date().getFullYear();

    return (
        <Rodape>
            <ConteudoRodape id="contatos">

                <Logo to={linkLogo}>
                    <img src={FerrarettoLogo} alt="Logo da S Ferraretto" />
                </Logo>

                <AreaContato>
                    <TituloArea>Contato</TituloArea>

                    <ListaContato>
                        <ItemContato>
                            <FaWhatsapp aria-hidden="true" />
                            <LinkContato
                                href={dadosEmpresa.whatsapp.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {dadosEmpresa.whatsapp.exibicao}
                            </LinkContato>
                        </ItemContato>

                        <ItemContato>
                            <FiMail aria-hidden="true" />
                            <LinkContato href={`mailto:${dadosEmpresa.email}`}>
                                {dadosEmpresa.email}
                            </LinkContato>
                        </ItemContato>

                        <ItemContato>
                            <FiMapPin aria-hidden="true" />
                            <LinkContato
                                href={dadosEmpresa.endereco.linkMapa}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {dadosEmpresa.endereco.exibicao}
                            </LinkContato>
                        </ItemContato>
                    </ListaContato>

                    <BotaoWhatsapp
                        href={dadosEmpresa.whatsapp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaWhatsapp aria-hidden="true" />
                        Fale conosco no WhatsApp
                    </BotaoWhatsapp>
                </AreaContato>

                <AreaContato>
                    <TituloArea>Empresa</TituloArea>

                    <ListaContato>
                        <ItemContato>
                            <FiFileText aria-hidden="true" />
                            <TextoContato>
                                {dadosEmpresa.razaoSocial}
                                <br />
                                CNPJ: {dadosEmpresa.cnpj}
                            </TextoContato>
                        </ItemContato>
                    </ListaContato>
                </AreaContato>
            </ConteudoRodape>

            <RodapeInferior>
                &copy; {anoAtual} {dadosEmpresa.nomeFantasia} · CNPJ {dadosEmpresa.cnpj} · Todos os direitos reservados
            </RodapeInferior>
        </Rodape>
    );
}

export default Footer;
