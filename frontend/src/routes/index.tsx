import { Routes, Route } from "react-router-dom";
import TelaInicial from "../pages/TelaInicial";
import Catalogo from "../pages/Catalogo/index";
import Cadastro from "../pages/Cadastro";
import Login from "../pages/Login/index";
import RotaProtegida from "../components/RotaProtegida";

function Rotas() {
    return (
        <Routes>
            <Route path="/" element={<TelaInicial />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/login" element={<Login />} />

            <Route element={<RotaProtegida />}>
                <Route path="/catalogo" element={<Catalogo />} />
            </Route>
        </Routes>
    );
}

export default Rotas;