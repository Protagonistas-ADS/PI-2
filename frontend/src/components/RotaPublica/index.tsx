import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

import { buscarUsuarioLogado } from "../../services/usuarioApi";
import type { PerfilUsuario } from "../../types/usuario";
import { paginaInicial, sairDaConta } from "../../utils/destinoAposLogin";

interface RotaPublicaProps {
    children: ReactNode;
}

// Telas para quem ainda não entrou (início, login, cadastro).
// Quem já está logado vai direto para a sua página: admin → painel, cliente → catálogo.
function RotaPublica({ children }: RotaPublicaProps) {
    const [carregamento, setCarregamento] = useState(true);
    const [perfilLogado, setPerfilLogado] = useState<PerfilUsuario | null>(null);

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
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    sairDaConta();
                }
            } finally {
                setCarregamento(false);
            }
        }

        verificarUsuario();
    }, []);

    if (carregamento) {
        return <p style={{ padding: 24 }}>Carregando...</p>;
    }

    if (perfilLogado) {
        return <Navigate to={paginaInicial(perfilLogado)} replace />;
    }

    return <>{children}</>;
}

export default RotaPublica;
