import { Routes, Route } from "react-router-dom";

import TelaInicial from "../pages/TelaInicial";
import Catalogo from "../pages/Catalogo";
import Cadastro from "../pages/Cadastro";
import Login from "../pages/Login";
import Perfil from "../pages/Perfil";

import RotaProtegida from "../components/RotaProtegida";
import RotaPublica from "../components/RotaPublica";

function Rotas() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <RotaPublica>
                        <TelaInicial />
                    </RotaPublica>
                }
            />
            <Route
                path="/cadastro"
                element={
                    <RotaPublica>
                        <Cadastro />
                    </RotaPublica>
                }
            />
            <Route
                path="/login"
                element={
                    <RotaPublica>
                        <Login />
                    </RotaPublica>
                }
            />
            <Route
                path="/catalogo"
                element={
                    <RotaProtegida>
                        <Catalogo />
                    </RotaProtegida>
                }
            />
            <Route 
                path="/perfil"
                element={
                    <RotaProtegida>
                        <Perfil />
                    </RotaProtegida>
                }
            />

        </Routes>
    );
}

export default Rotas;