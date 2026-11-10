
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { buscarUsuarioLogado } from "../../services/usuariosApi";

interface RotaProtegidaProps {
    children: ReactNode;
}

function RotaProtegida({ children }: RotaProtegidaProps) {
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
            localStorage.removeItem("token");
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

    if (!autenticado) {
        return <Navigate to="/login" replace />;
    }

    return <>{ children }</>

}

export default RotaProtegida;
