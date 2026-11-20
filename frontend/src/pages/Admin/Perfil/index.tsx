import PainelConta from "../../../components/PainelConta";
import { CabecalhoPagina } from "../style";

// Perfil do administrador: mesmos dados e troca de senha do cliente, dentro do painel
function PerfilAdmin() {
    return (
        <>
            <CabecalhoPagina>
                <h1>Meu perfil</h1>
                <p>Altere seu nome ou sua senha. O e-mail é o login da conta e não muda por aqui.</p>
            </CabecalhoPagina>

            <PainelConta />
        </>
    );
}

export default PerfilAdmin;
