import { useState } from "react";
import {
    Cabecalho,
    ConteudoCabecalho,
    Logo,
    SimboloLogo,
    IdentificacaoMarca,
    NomeMarca,
    Laranja,
    DescricaoMarca,
    BotaoMenu,
    Navegacao,
    ListaLinks,
    ItemLink,
} from "./style";
import { FiX, FiMenu } from "react-icons/fi";

interface ItemNavegacao {
    id: number;
    texto: string;
    href: string;
    ativo: boolean;
}

interface NavbarProps {
    links: ItemNavegacao[];
}

function Navbar({ links }: NavbarProps) {
    const [menuAberto, setMenuAberto] = useState(false);

    function alternarMenu() {
        setMenuAberto((valor) => !valor);
    }

    function fecharMenu() {
        setMenuAberto(false);
    }

    return (
        <Cabecalho>
            <ConteudoCabecalho>
                <Logo href="/"> 
                    <SimboloLogo>S.F</SimboloLogo>

                    <IdentificacaoMarca>
                        <NomeMarca>
                            S.<Laranja>FERRARETTO</Laranja>
                        </NomeMarca>

                        <DescricaoMarca>Paletes de Madeira</DescricaoMarca>
                    </IdentificacaoMarca>
                </Logo>

                <BotaoMenu
                    type="button"
                    onClick={alternarMenu}
                >
                    {menuAberto ? <FiX color="white" size={24} /> : <FiMenu color="white" size={24}/>}
                </BotaoMenu>

                <Navegacao
                    id="navegacao-principal"
                    $menuAberto={menuAberto}
                >
                    <ListaLinks>
                        {links.map((link) => (
                            <li key={link.id}>
                                <ItemLink
                                    href={link.href}
                                    $ativo={link.ativo ?? false}
                                    onClick={fecharMenu}
                                >
                                    {link.texto}
                                </ItemLink>
                            </li>
                        ))}
                    </ListaLinks>
                </Navegacao>
            </ConteudoCabecalho>
        </Cabecalho>
    )
} 

export default Navbar;