import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import { cadastrarUsuario } from "../../../services/usuarioApi";

import BotaoGeral from "../../../components/BotaoGeral";
import FormularioGeral from "../../../components/FormularioGeral";
import InputGeral from "../../../components/InputGeral";

import { obterMensagemErro } from "../../../utils/obterMensagemErro";
import { 
    toastSucesso,
    swalErro
} from "../../../utils/alertas";

import {
    ContainerPagina,
    ContainerVoltar
} from "./style";





function Cadastro() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            await cadastrarUsuario({
                nome: nome.trim(),
                email: email.trim().toLowerCase(),
                senha
            });
            toastSucesso("Cadastrado com sucesso.");
            navigate('/login');
        } catch (error) {
            swalErro(obterMensagemErro(error, "Não foi possível cadastrar o usuário"));
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
                    placeholder="seu@email.com"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <InputGeral
                    type="password"
                    placeholder="Senha - Mínimo 6 caracteres"
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