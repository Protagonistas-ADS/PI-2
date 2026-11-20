import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    FiGrid,
    FiShoppingBag,
    FiUsers,
    FiRepeat,
    FiDollarSign,
    FiFileText,
    FiUser,
    FiLogOut,
    FiExternalLink,
    FiMenu,
    FiX
} from "react-icons/fi";

import FerrarettoLogo from "../../assets/FerrarettoLogo.png";
import { sairDaConta } from "../../utils/destinoAposLogin";

import {
    Estrutura,
    BarraTopo,
    BotaoMenu,
    Fundo,
    MenuLateral,
    LogoMenu,
    ListaMenu,
    ItemMenu,
    BotaoSair,
    RodapeMenu,
    AreaConteudo
} from "./style";

// Itens do menu do painel (as tabelas chegam na Etapa 9).
// "Dashboard" (/admin) só fica marcado na própria tela, não nas de dentro (end).
const ITENS_MENU = [
    { caminho: "/admin", texto: "Dashboard", icone: <FiGrid /> },
    { caminho: "/admin/pedidos", texto: "Pedidos", icone: <FiShoppingBag /> },
    { caminho: "/admin/usuarios", texto: "Usuários", icone: <FiUsers /> },
    { caminho: "/admin/movimentacoes", texto: "Movimentações", icone: <FiRepeat /> },
    { caminho: "/admin/vendas", texto: "Vendas", icone: <FiDollarSign /> },
    { caminho: "/admin/notas", texto: "Notas fiscais", icone: <FiFileText /> },
    { caminho: "/admin/perfil", texto: "Perfil", icone: <FiUser /> },
];

// Molde de todas as telas do administrador: menu à esquerda e a tela à direita.
// No celular o menu vira uma gaveta que abre pelo botão ☰.
function LayoutAdmin() {
    const [menuAberto, setMenuAberto] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Trocou de tela: fecha a gaveta e volta ao topo
    useEffect(() => {
        setMenuAberto(false);
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // Esc fecha a gaveta
    useEffect(() => {
        if (!menuAberto) return;

        function aoTeclar(evento: KeyboardEvent) {
            if (evento.key === "Escape") setMenuAberto(false);
        }

        window.addEventListener("keydown", aoTeclar);
        return () => window.removeEventListener("keydown", aoTeclar);
    }, [menuAberto]);

    function handleLogout() {
        sairDaConta();
        navigate("/login", { replace: true });
    }

    return (
        <Estrutura>
            <BarraTopo>
                <BotaoMenu
                    type="button"
                    onClick={() => setMenuAberto((valor) => !valor)}
                    aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
                    aria-expanded={menuAberto}
                >
                    {menuAberto ? <FiX /> : <FiMenu />}
                </BotaoMenu>
                <img src={FerrarettoLogo} alt="S Ferraretto" />
                <span>Painel</span>
            </BarraTopo>

            {menuAberto && <Fundo onClick={() => setMenuAberto(false)} />}

            <MenuLateral $aberto={menuAberto} aria-label="Menu do administrador">
                <LogoMenu>
                    <img src={FerrarettoLogo} alt="S Ferraretto" />
                    <span>Painel do administrador</span>
                </LogoMenu>

                <ListaMenu>
                    {ITENS_MENU.map((item) => (
                        <li key={item.caminho}>
                            <ItemMenu to={item.caminho} end={item.caminho === "/admin"}>
                                {item.icone}
                                {item.texto}
                            </ItemMenu>
                        </li>
                    ))}
                </ListaMenu>

                <RodapeMenu>
                    <ItemMenu to="/catalogo">
                        <FiExternalLink />
                        Ver catálogo
                    </ItemMenu>
                    <BotaoSair type="button" onClick={handleLogout}>
                        <FiLogOut />
                        Sair
                    </BotaoSair>
                </RodapeMenu>
            </MenuLateral>

            <AreaConteudo>
                <Outlet />
            </AreaConteudo>
        </Estrutura>
    );
}

export default LayoutAdmin;
