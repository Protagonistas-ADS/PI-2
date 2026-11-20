import { Link } from "react-router-dom";
import { CabecalhoPagina, CaixaAviso } from "../style";

interface EmBreveProps {
    titulo: string;
}

// Lugar reservado no menu para as tabelas que chegam na próxima etapa
function EmBreve({ titulo }: EmBreveProps) {
    return (
        <>
            <CabecalhoPagina>
                <h1>{titulo}</h1>
            </CabecalhoPagina>

            <CaixaAviso>
                <p>Esta tela está em construção e chega na próxima atualização do painel.</p>
                <p>
                    Enquanto isso, os pedidos podem ser acompanhados e atualizados no{" "}
                    <Link to="/admin">Dashboard</Link>.
                </p>
            </CaixaAviso>
        </>
    );
}

export default EmBreve;
