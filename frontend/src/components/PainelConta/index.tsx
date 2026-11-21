import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FiEye, FiEyeOff, FiRefreshCw } from "react-icons/fi";

import BotaoGeral from "../BotaoGeral";

import { buscarUsuarioLogado, atualizarUsuario } from "../../services/usuarioApi";
import type { UsuarioLogado } from "../../types/usuario";

import { obterMensagemErro } from "../../utils/obterMensagemErro";
import { toastSucesso, swalErro, swalAviso } from "../../utils/alertas";

import {
    GridPerfil,
    PainelPerfil,
    GrupoCampo,
    CampoInformacao,
    AvisoConta,
} from "./style";

// "2026-11-20T15:00:00.000Z" -> "20/11/2026"
function formatarData(valor: string | undefined) {
    return valor ? new Date(valor).toLocaleDateString("pt-BR") : "";
}

// Dados da conta + troca de senha. Usado no perfil do cliente e no do administrador.
// O e-mail não é editável (é o login da conta).
function PainelConta() {
    const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState("");
    const [salvandoNome, setSalvandoNome] = useState(false);
    const [salvandoSenha, setSalvandoSenha] = useState(false);
    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");
    const [senhaNova, setSenhaNova] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
    const [mostrarSenhaNova, setMostrarSenhaNova] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

    const nomeAlterado = usuario !== null && nome !== usuario.nome;

    async function carregarUsuario() {
        setCarregando(true);
        try {
            const dados = await buscarUsuarioLogado();
            setUsuario(dados);
            setNome(dados.nome);
            setErroCarregamento("");
        } catch (error) {
            setErroCarregamento(obterMensagemErro(error, "Não foi possível carregar os dados da conta."));
        } finally {
            setCarregando(false);
        }
    }

    function validarSenha() {
        if (!senha || !senhaNova || !confirmarSenha) {
            swalAviso("Preencha todos os campos de senha.");
            return false;
        }

        if (senhaNova.length < 6) {
            swalAviso("A nova senha deve ter ao menos 6 caracteres.");
            return false;
        }

        if (senhaNova !== confirmarSenha) {
            swalAviso("A nova senha e a confirmação não coincidem.");
            return false;
        }

        return true;
    }

    async function atualizarNome() {
        if (salvandoNome) return;

        if (nome.trim().length < 2) {
            swalAviso("O nome deve ter ao menos 2 caracteres.");
            return;
        }

        setSalvandoNome(true);
        try {
            await atualizarUsuario({ nome: nome.trim() });
            const dados = await buscarUsuarioLogado();
            setUsuario(dados);
            setNome(dados.nome);
            toastSucesso("Nome atualizado com sucesso!");
        } catch (error) {
            swalErro(obterMensagemErro(error, "Não foi possível alterar o nome"));
        } finally {
            setSalvandoNome(false);
        }
    }

    async function atualizarSenha() {
        if (salvandoSenha || !validarSenha()) return;

        setSalvandoSenha(true);
        try {
            await atualizarUsuario({ senhaAtual: senha, senhaNova });

            setSenha("");
            setSenhaNova("");
            setConfirmarSenha("");

            toastSucesso("Senha alterada com sucesso!");
        } catch (error) {
            swalErro(obterMensagemErro(error, "Não foi possível alterar a senha"));
        } finally {
            setSalvandoSenha(false);
        }
    }

    useEffect(() => {
        carregarUsuario();
    }, []);

    if (carregando && !usuario) {
        return (
            <AvisoConta role="status">
                <p>Carregando os dados da conta...</p>
            </AvisoConta>
        );
    }

    if (erroCarregamento || !usuario) {
        return (
            <AvisoConta role="alert">
                <p>{erroCarregamento || "Não foi possível carregar os dados da conta."}</p>
                <button type="button" onClick={carregarUsuario}>
                    <FiRefreshCw aria-hidden="true" /> Tentar de novo
                </button>
            </AvisoConta>
        );
    }

    return (
        <GridPerfil>
            <PainelPerfil>
                <h2>Informações da Conta</h2>

                <GrupoCampo>
                    <label htmlFor="nome">Nome:</label>
                    <CampoInformacao
                        id="nome"
                        type="text"
                        value={nome}
                        maxLength={255}
                        onChange={(event) => setNome(event.target.value)}
                        onBlur={() => setNome(usuario?.nome ?? "")}
                    />

                    {nomeAlterado && (
                        <button
                            type="button"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={atualizarNome}
                            className="button-alterar-nome"
                            aria-label={salvandoNome ? "Salvando nome" : "Salvar nome"}
                            disabled={salvandoNome}
                        >
                            <FaCheck />
                        </button>
                    )}
                </GrupoCampo>

                <GrupoCampo>
                    <label>E-mail:</label>
                    <p>{usuario.email}</p>
                </GrupoCampo>

                <GrupoCampo>
                    <label>Perfil:</label>
                    <p>{usuario.perfil === "administrador" ? "Administrador" : "Cliente"}</p>
                </GrupoCampo>

                <GrupoCampo>
                    <label>Conta criada em:</label>
                    <p>{formatarData(usuario.criado_em)}</p>
                </GrupoCampo>
            </PainelPerfil>

            <PainelPerfil>
                <h2>Alterar Senha</h2>

                <GrupoCampo>
                    <label htmlFor="senha">Senha Atual:</label>

                    <div className="campo-senha">
                        <CampoInformacao
                            id="senha"
                            type={mostrarSenhaAtual ? "text" : "password"}
                            autoComplete="current-password"
                            value={senha}
                            onChange={(event) => setSenha(event.target.value)}
                        />

                        <button
                            type="button"
                            onClick={() => setMostrarSenhaAtual((valor) => !valor)}
                            className="icone-senha"
                            aria-label={mostrarSenhaAtual ? "Esconder senha" : "Mostrar senha"}
                        >
                            {mostrarSenhaAtual ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                </GrupoCampo>

                <GrupoCampo>
                    <label htmlFor="senhaNova">Nova Senha:</label>

                    <div className="campo-senha">
                        <CampoInformacao
                            id="senhaNova"
                            type={mostrarSenhaNova ? "text" : "password"}
                            autoComplete="new-password"
                            value={senhaNova}
                            onChange={(event) => setSenhaNova(event.target.value)}
                        />

                        <button
                            type="button"
                            onClick={() => setMostrarSenhaNova((valor) => !valor)}
                            className="icone-senha"
                            aria-label={mostrarSenhaNova ? "Esconder senha" : "Mostrar senha"}
                        >
                            {mostrarSenhaNova ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                </GrupoCampo>

                <GrupoCampo>
                    <label htmlFor="confirmarSenha">Confirmar Nova Senha:</label>

                    <div className="campo-senha">
                        <CampoInformacao
                            id="confirmarSenha"
                            type={mostrarConfirmarSenha ? "text" : "password"}
                            autoComplete="new-password"
                            value={confirmarSenha}
                            onChange={(event) => setConfirmarSenha(event.target.value)}
                        />

                        <button
                            type="button"
                            onClick={() => setMostrarConfirmarSenha((valor) => !valor)}
                            className="icone-senha"
                            aria-label={mostrarConfirmarSenha ? "Esconder senha" : "Mostrar senha"}
                        >
                            {mostrarConfirmarSenha ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                </GrupoCampo>

                <BotaoGeral
                    texto={salvandoSenha ? "Salvando..." : "Salvar"}
                    width="100%"
                    padding="15px"
                    margin="28px 0"
                    onClick={atualizarSenha}
                    desabilitado={salvandoSenha}
                />
            </PainelPerfil>
        </GridPerfil>
    );
}

export default PainelConta;
