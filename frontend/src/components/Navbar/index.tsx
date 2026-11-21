import { useEffect, useState } from "react";
import {
    Cabecalho,
    ConteudoCabecalho,
    Logo,
    BotaoMenu,
    Navegacao,
    ListaLinks,
    ItemLink,
    ItemAncora
} from "./style";
import { FiX, FiMenu } from "react-icons/fi";
import FerrarettoLogo from "../../assets/FerrarettoLogo.png";

interface ItemNavegacao {
    id: number;
    texto: string;
    href: string;
    ativo: boolean;
    aoClicar?: () => void;
}

interface NavbarProps {
    linkLogo: string;
    links: ItemNavegacao[];
}

function Navbar({ linkLogo, links }: NavbarProps) {
    const [menuAberto, setMenuAberto] = useState(false);

    function alternarMenu() {
        setMenuAberto((valor) => !valor);
    }

    function fecharMenu() {
        setMenuAberto(false);
    }

    // Menu do celular aberto: a tecla Esc fecha
    useEffect(() => {
        if (!menuAberto) return;

        function aoTeclar(evento: KeyboardEvent) {
            if (evento.key === "Escape") setMenuAberto(false);
        }

        window.addEventListener("keydown", aoTeclar);
        return () => window.removeEventListener("keydown", aoTeclar);
    }, [menuAberto]);

    return (
        <Cabecalho>
            <ConteudoCabecalho>
                <Logo to={linkLogo}>
                    <img src={FerrarettoLogo} alt="Logo da empresa" />
                </Logo>

                <BotaoMenu
                    type="button"
                    onClick={alternarMenu}
                    aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
                    aria-expanded={menuAberto}
                    aria-controls="navegacao-principal"
                >
                    {menuAberto ? <FiX color="white" size={24} /> : <FiMenu color="white" size={24} />}
                </BotaoMenu>

                <Navegacao
                    id="navegacao-principal"
                    $menuAberto={menuAberto}
                >
                    <ListaLinks>
                        {links.map((link) => (
                            <li key={link.id}>
                                {link.href.startsWith("#") ? (
                                    <ItemAncora
                                        href={link.href}
                                        onClick={() => {
                                            fecharMenu();
                                            link.aoClicar?.();
                                        }}
                                    >
                                        {link.texto}
                                    </ItemAncora>
                                ) : (
                                    <ItemLink
                                        to={link.href}
                                        $ativo={link.ativo ?? false}
                                        onClick={() => {
                                            fecharMenu();
                                            link.aoClicar?.()
                                        }}
                                    >
                                        {link.texto}
                                    </ItemLink>
                                )}
                            </li>
                        ))}
                    </ListaLinks>
                </Navegacao>
            </ConteudoCabecalho>
        </Cabecalho>
    )
}

export default Navbar;