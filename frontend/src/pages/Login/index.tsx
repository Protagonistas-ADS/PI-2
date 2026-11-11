import { use, useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";

import { autenticarLogin } from "../../services/usuarioApi";
import BotaoGeral from "../../components/BotaoGeral";
import FormularioGeral from "../../components/FormularioGeral";
import InputGeral from "../../components/InputGeral";

import { 
    ContainerPagina,
    ContainerVoltar,
} from "./style";

import { FaArrowLeft } from "react-icons/fa";

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const navigate = useNavigate();


    async function handleLogin(event: SyntheticEvent<HTMLFormElement>) {
            event.preventDefault();
            
            try {
                const data = await autenticarLogin({ email, senha });

                
                
                localStorage.setItem("token", data.token);
                localStorage.setItem("payload", JSON.stringify(data.payload));
                navigate("/catalogo");
            } catch (error) {
                alert("Erro ao realizar login.");
                console.error("Erro ao realizar login", error);
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
                    placeholder="seuEmail@gmail.com"
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