import { Routes, Route } from "react-router-dom";
import TelaInicial from "../pages/TelaInicial";
import Catalogo from "../pages/Catalogo/index";
import Cadastro from "../pages/Cadastro";
import Login from "../pages/Login/index";


function Rotas() {
    
    return (
        <Routes>
            <Route path="/" element={<TelaInicial />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/cadastro" element={<Cadastro/>} />
            <Route path="/login" element={<Login/>} />
        </Routes>
    )
}

export default Rotas;