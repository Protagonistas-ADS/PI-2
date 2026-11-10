
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { buscarUsuarioLogado } from "../../services/usuariosApi";

interface RotaPublicaProps {
    children: ReactNode;
}

function RotaPublica({ children }: RotaPublicaProps) {
    const [carregamento, setCarregamento] = useState(true);
    const [autenticado, setAutenticado] = useState(false);


    async function verificarUsuario() {
        const token = localStorage.getItem("token");

        if (!token) {
            setCarregamento(false);
            return;
        }

        try {
            await buscarUsuarioLogado(token);
            setAutenticado(true);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                localStorage.removeItem("token");
            }
        } finally {
            setCarregamento(false);
        }
    }

    useEffect(() => {
        verificarUsuario();
    }, []);


    if (carregamento) {
        return <p>Carregando...</p>
    }

    if (autenticado) {
        return <Navigate to="/catalogo" replace />;
    }

    return <>{ children }</>

}

export default RotaPublica;
