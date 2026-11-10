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

            <Route
                path="/catalogo"
                element={
                    <RotaProtegida>
                        <Catalogo />
                    </RotaProtegida>
                } 
            />
            
        </Routes>
    );
}

export default Rotas;