
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { buscarUsuarioLogado } from "../../services/usuariosApi";

function RotaProtegida() {
    const [carregando, setCarregando] = useState(true);
    const [autenticado, setAutenticado] = useState(false);

    useEffect(() => {
        async function verificarUsuario() {
            const token = localStorage.getItem("token");

            if (!token) {
                setCarregando(false);
                return;
            }

            try {
                await buscarUsuarioLogado(token);
                setAutenticado(true);
            } catch (error) {
                localStorage.removeItem("token");
            } finally {
                setCarregando(false);
            }
        }

        verificarUsuario();
    }, []);

    if (carregando) {
        return <p>Verificando autenticação...</p>;
    }

    if (!autenticado) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default RotaProtegida;
