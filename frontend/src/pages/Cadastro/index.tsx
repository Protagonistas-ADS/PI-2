import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
    ContainerPagina,
    ContainerVoltar
} from "./style";

import { cadastrarUsuario } from "../../services/usuariosApi";

import BotaoGeral from "../../components/BotaoGeral";
import FormularioGeral from "../../components/FormularioGeral";
import InputGeral from "../../components/InputGeral";

import { FaArrowLeft } from "react-icons/fa";

function Cadastro() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            await cadastrarUsuario({ nome, email, senha });

            navigate('/login');
        } catch (error) {
            alert("Erro ao realizar cadastro.");
            console.error("ERRO AQUI", error);
        }
    }

    return (
        <ContainerPagina>
            <ContainerVoltar>
                <BotaoGeral
                    texto="Voltar"
                    destino="/"
                    icone={<FaArrowLeft />}
                />
            </ContainerVoltar>

            <FormularioGeral
                titulo="Cadastro"
                textoLink="Fazer Login"
                destinoLink="/login"
                onSubmit={handleSubmit}
            >

                <InputGeral
                    type="text"
                    placeholder="Nome completo"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                    required
                />

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
                    texto="Cadastrar-se"
                    width="200px"
                    height="60px"
                    type="submit"
                />
            </FormularioGeral>
        </ContainerPagina>
    );
}

export default Cadastro;