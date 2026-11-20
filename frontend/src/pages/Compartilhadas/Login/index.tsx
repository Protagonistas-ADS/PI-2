import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import { autenticarLogin } from "../../../services/usuarioApi";
import BotaoGeral from "../../../components/BotaoGeral";
import FormularioGeral from "../../../components/FormularioGeral";
import InputGeral from "../../../components/InputGeral";

import { obterMensagemErro } from "../../../utils/obterMensagemErro";
import { obterDestinoAposLogin } from "../../../utils/destinoAposLogin";
import { 
    swalErro
} from "../../../utils/alertas";

import { 
    ContainerPagina,
    ContainerVoltar,
} from "./style";




function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const navigate = useNavigate();


    async function handleLogin(event: SyntheticEvent<HTMLFormElement>) {
            event.preventDefault();
            
            try {
                const data = await autenticarLogin({ email: email.trim().toLowerCase(), senha });
                
                localStorage.setItem("token", data.token);
                localStorage.setItem("payload", JSON.stringify(data.payload));
                // Admin vai para o painel; cliente volta para onde estava (ou catálogo)
                navigate(obterDestinoAposLogin(data.payload.perfil), { replace: true });
            } catch (error) {
                swalErro(obterMensagemErro(error, "Não foi possível fazer login"));
            }
        }

    return (
        <ContainerPagina>
            <ContainerVoltar>

                <BotaoGeral
                    destino="/" 
                    icone={<FaArrowLeft/> }
                    texto="Voltar" 
                />
            </ContainerVoltar>

            <FormularioGeral
                titulo="Login"
                textoLink="Fazer Cadastro"
                destinoLink="/cadastro"
                onSubmit={handleLogin}
            >
                <InputGeral
                    type="email"
                    placeholder="seu@email.com"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <InputGeral
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    required
                    minLength={6}
                />

                <BotaoGeral
                    texto="Entrar"
                    width="200px"
                    height="60px"
                    type="submit"
                />

            </FormularioGeral>

        </ContainerPagina>
    );
}

export default Login;