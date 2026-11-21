import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { Navigate, useLocation } from "react-router-dom";
import { FiRefreshCw } from "react-icons/fi";

import { buscarUsuarioLogado } from "../../services/usuarioApi";
import type { PerfilUsuario } from "../../types/usuario";
import { guardarDestinoAposLogin, paginaInicial, sairDaConta } from "../../utils/destinoAposLogin";
import { obterMensagemErro } from "../../utils/obterMensagemErro";
import { toastAviso } from "../../utils/alertas";

import { AvisoRota } from "./style";

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
    const [erroConexao, setErroConexao] = useState("");
    const [tentativa, setTentativa] = useState(0);
    const location = useLocation();

    useEffect(() => {
        async function verificarUsuario() {
            if (!localStorage.getItem("token")) {
                setCarregamento(false);
                return;
            }

            setCarregamento(true);
            setErroConexao("");

            try {
                const usuario = await buscarUsuarioLogado();
                setPerfilLogado(usuario.perfil);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    // Token vencido ou inválido: sai da conta (vai para o login)
                    sairDaConta();
                } else {
                    // Servidor fora do ar ou erro inesperado: a sessão continua; mostra o aviso
                    setErroConexao(obterMensagemErro(error, "Não foi possível verificar sua conta agora."));
                }
            } finally {
                setCarregamento(false);
            }
        }

        verificarUsuario();
    }, [tentativa]);

    const acessoNegado = perfilLogado !== null && perfil !== undefined && perfilLogado !== perfil;

    // Avisa uma vez quando alguém tenta abrir a área do outro perfil
    useEffect(() => {
        if (acessoNegado && perfil === "administrador") {
            toastAviso("Área restrita para administradores.");
        }
    }, [acessoNegado, perfil]);

    if (carregamento) {
        return (
            <AvisoRota role="status">
                <p>Carregando...</p>
            </AvisoRota>
        );
    }

    if (erroConexao) {
        return (
            <AvisoRota role="alert">
                <p>{erroConexao}</p>
                <button type="button" onClick={() => setTentativa((valor) => valor + 1)}>
                    <FiRefreshCw aria-hidden="true" /> Tentar de novo
                </button>
            </AvisoRota>
        );
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
