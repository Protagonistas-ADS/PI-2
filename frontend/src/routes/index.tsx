import { Routes, Route } from "react-router-dom";

import TelaInicial from "../pages/Compartilhadas/TelaInicial";
import Catalogo from "../pages/Cliente/Catalogo";
import Cadastro from "../pages/Compartilhadas/Cadastro";
import Login from "../pages/Compartilhadas/Login";
import Perfil from "../pages/Cliente/Perfil";
import MeusPedidos from "../pages/Cliente/MeusPedidos";

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
            {/* Catálogo é público: o visitante vê os produtos sem login */}
            <Route path="/catalogo" element={<Catalogo />} />
            <Route
                path="/perfil"
                element={
                    <RotaProtegida>
                        <Perfil />
                    </RotaProtegida>
                }
            />
            <Route
                path="/clientePedidos"
                element={
                    <RotaProtegida>
                        <MeusPedidos />
                    </RotaProtegida>
                }
            />

        </Routes>
    );
}

export default Rotas;