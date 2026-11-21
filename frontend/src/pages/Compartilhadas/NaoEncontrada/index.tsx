import { Link, useNavigate } from "react-router-dom";
import { FiHome, FiGrid } from "react-icons/fi";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

import type { PerfilUsuario } from "../../../types/usuario";
import { paginaInicial, sairDaConta } from "../../../utils/destinoAposLogin";

import { ContainerPagina, Conteudo, Codigo, Acoes } from "./style";

// Perfil guardado no login. Serve só para montar o menu desta página
// (quem protege as telas de verdade são as rotas e o backend).
function perfilSalvo(): PerfilUsuario | null {
    try {
        if (!localStorage.getItem("token")) return null;
        const payload = JSON.parse(localStorage.getItem("payload") ?? "null");
        return payload?.perfil === "administrador" || payload?.perfil === "cliente" ? payload.perfil : null;
    } catch {
        return null;
    }
}

// Endereço que não existe no site (ex.: /qualquer-coisa).
// O painel do administrador tem a sua própria (pages/Admin/NaoEncontrada).
function NaoEncontrada() {
    const navigate = useNavigate();
    const perfil = perfilSalvo();
    const inicio = perfil ? paginaInicial(perfil) : "/";

    function handleLogout() {
        sairDaConta();
        navigate("/login");
    }

    const linksNavegacao = perfil === "administrador"
        ? [
            { id: 1, texto: "Catálogo", href: "/catalogo", ativo: false },
            { id: 2, texto: "Painel", href: "/admin", ativo: false },
            { id: 3, texto: "Sair", href: "/login", ativo: false, aoClicar: handleLogout },
        ]
        : perfil === "cliente"
        ? [
            { id: 1, texto: "Catálogo", href: "/catalogo", ativo: false },
            { id: 2, texto: "Meus Pedidos", href: "/clientePedidos", ativo: false },
            { id: 3, texto: "Perfil", href: "/perfil", ativo: false },
            { id: 4, texto: "Sair", href: "/login", ativo: false, aoClicar: handleLogout },
        ]
        : [
            { id: 1, texto: "Catálogo", href: "/catalogo", ativo: false },
            { id: 2, texto: "Entrar", href: "/login", ativo: false },
            { id: 3, texto: "Criar Conta", href: "/cadastro", ativo: false },
        ];

    return (
        <ContainerPagina>
            <Navbar linkLogo={inicio} links={linksNavegacao} />

            <Conteudo>
                <Codigo aria-hidden="true">404</Codigo>
                <h1>Página não encontrada</h1>
                <p>
                    O endereço que você abriu não existe ou foi alterado.
                    Confira se digitou certo ou use um dos botões abaixo.
                </p>

                <Acoes>
                    <Link to={inicio} className="principal">
                        <FiHome aria-hidden="true" />
                        {perfil === "administrador" ? "Voltar ao painel" : "Voltar ao início"}
                    </Link>
                    {inicio !== "/catalogo" && (
                        <Link to="/catalogo" className="secundario">
                            <FiGrid aria-hidden="true" />
                            Ver catálogo
                        </Link>
                    )}
                </Acoes>
            </Conteudo>

            <Footer linkLogo={inicio} />
        </ContainerPagina>
    );
}

export default NaoEncontrada;
