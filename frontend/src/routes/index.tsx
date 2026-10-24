import { Routes, Route } from "react-router-dom";
import TelaInicial from "../pages/TelaInicial";
import Catalogo from "../pages/Catalogo/index";


function Rotas() {
    
    return (
        <Routes>
            <Route path="/" element={<TelaInicial />} />
            <Route path="/catalogo" element={<Catalogo />} />
        </Routes>
    )
}

export default Rotas;