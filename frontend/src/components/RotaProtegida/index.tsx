import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { Navigate, useLocation } from "react-router-dom";

import { buscarUsuarioLogado } from "../../services/usuarioApi";
import type { PerfilUsuario } from "../../types/usuario";
import { guardarDestinoAposLogin, paginaInicial, sairDaConta } from "../../utils/destinoAposLogin";
import { toastAviso } from "../../utils/alertas";

interface RotaProtegidaProps {
    children: ReactNode;
    // Se informado, só esse perfil entra (o outro volta para a própria página inicial)
    perfil?: PerfilUsuario;
}

// Porteiro das telas que exigem login.
// Quem decide o perfil é o servidor (GET /usuarios/logado), não o que está salvo no navegador.
// Isto só ajuda a navegação: a proteção de verdade está no backend (401/403).
function RotaProtegida({ children, perfil }: RotaProtegidaProps) {
    const [carregamento, setCarregamento] = useState(true);
    const [perfilLogado, setPerfilLogado] = useState<PerfilUsuario | null>(null);
    const location = useLocation();

    useEffect(() => {
        async function verificarUsuario() {
            if (!localStorage.getItem("token")) {
                setCarregamento(false);
                return;
            }

            try {
                const usuario = await buscarUsuarioLogado();
                setPerfilLogado(usuario.perfil);
            } catch (error) {
                // Token vencido ou inválido: sai da conta
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    sairDaConta();
                }
            } finally {
                setCarregamento(false);
            }
        }

        verificarUsuario();
    }, []);

    const acessoNegado = perfilLogado !== null && perfil !== undefined && perfilLogado !== perfil;

    // Avisa uma vez quando alguém tenta abrir a área do outro perfil
    useEffect(() => {
        if (acessoNegado && perfil === "administrador") {
            toastAviso("Área restrita para administradores.");
        }
    }, [acessoNegado, perfil]);

    if (carregamento) {
        return <p style={{ padding: 24 }}>Carregando...</p>;
    }

    if (!perfilLogado) {
        // Depois do login, volta para a tela que a pessoa tentou abrir
        guardarDestinoAposLogin(location.pathname);
        return <Navigate to="/login" replace />;
    }

    if (acessoNegado) {
        return <Navigate to={paginaInicial(perfilLogado)} replace />;
    }

    return <>{children}</>;
}

export default RotaProtegida;
