import { Link } from "react-router-dom";
import { CabecalhoPagina, CaixaAviso } from "../style";

// Endereço que não existe dentro do painel (ex.: /admin/qualquer-coisa)
function NaoEncontrada() {
    return (
        <>
            <CabecalhoPagina>
                <h1>Página não encontrada</h1>
            </CabecalhoPagina>

            <CaixaAviso>
                <p>Este endereço não existe no painel do administrador.</p>
                <p>
                    Use o menu ao lado ou volte para o <Link to="/admin">Dashboard</Link>.
                </p>
            </CaixaAviso>
        </>
    );
}

export default NaoEncontrada;
