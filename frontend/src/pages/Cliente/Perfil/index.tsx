import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

import BotaoGeral from "../../../components/BotaoGeral";
import Navbar from "../../../components/Navbar";

import { buscarUsuarioLogado, atualizarUsuario } from "../../../services/usuarioApi";

import { obterMensagemErro } from "../../../utils/obterMensagemErro";
import {
    toastSucesso,
    swalErro,
    swalAviso
} from "../../../utils/alertas";

import {
    ContainerPagina,
    Conteudo,
    CabecalhoPerfil,
    GridPerfil,
    PainelPerfil,
    GrupoCampo,
    CampoInformacao,
} from "./style";


interface Usuario {
    id: number;
    nome: string;
    email: string;
    perfil: "cliente" | "administrador";
}


function Perfil() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");
    const [senhaNova, setSenhaNova] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
    const [mostrarSenhaNova, setMostrarSenhaNova] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

    const nomeAlterado = nome !== usuario?.nome;
    const navigate = useNavigate();

    async function carregarUsuario() {
        try {
            const dados = await buscarUsuarioLogado();
            setUsuario(dados);

            setNome(dados.nome);
        } catch (error) {
            console.error("Erro ao carregar usuário", error);
        }
    }

    function handleLogout() {
        localStorage.removeItem("token");
        navigate('/login');
    }

    const linksNavegacao = [
        { id: 2, texto: "Pedidos/Cotações", href: "/catalogo", ativo: false },
        { id: 1, texto: "Perfil", href: "/perfil", ativo: false },
        { id: 4, texto: "Sair", href: "/login", ativo: false, aoClicar: handleLogout },
    ];

    function validarSenha() {
        if (!senha || !senhaNova || !confirmarSenha) {
            swalAviso("Preencha todos os campos de senha.");
            return false;
        }

        if (senhaNova !== confirmarSenha) {
            swalAviso("A nova senha e a confirmação não coincidem.");
            return false;
        }

        return true;
    }

    async function atualizarNome() {
        if (!nome.trim()) {
            swalAviso("O nome não pode ficar vazio.");
            return;
        }

        try {
            await atualizarUsuario({ nome });

            await carregarUsuario();

            toastSucesso("Nome atualizado com sucesso!");
        } catch (error) {
            swalErro(obterMensagemErro(error, "Não foi possível alterar o nome"));
        }
    }

    async function atualizarSenha() {
        if (!validarSenha()) return;

        try {
            await atualizarUsuario({
                senhaAtual: senha,
                senhaNova,
            });

            setSenha("");
            setSenhaNova("");
            setConfirmarSenha("");

            toastSucesso("Senha alterada com sucesso!");
        } catch (error) {
            swalErro(obterMensagemErro(error, "Não foi possível alterar a senha"));
        }
    }

    useEffect(() => {
        carregarUsuario();
    }, []);

    return (
        <ContainerPagina>
            <Navbar
                linkLogo="/catalogo"
                links={linksNavegacao}
            />

            <CabecalhoPerfil>
                <BotaoGeral
                    texto="Voltar"
                    destino="/catalogo"
                    icone={<FaArrowLeft />}
                />
                <h1>Meu Perfil</h1>
            </CabecalhoPerfil>
            <Conteudo>

                <GridPerfil>
                    <PainelPerfil>
                        <h2>Informações da Conta</h2>

                        <GrupoCampo>
                            <label htmlFor="nome">Nome:</label>
                            <CampoInformacao
                                id="nome"
                                type="text"
                                value={nome}
                                onChange={(event) => setNome(event.target.value)}
                                onBlur={() => setNome(usuario?.nome ?? "")}
                            />

                            {nomeAlterado && (
                                <button
                                    type="button"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={atualizarNome}
                                    className="button-alterar-nome"
                                >
                                    <FaCheck />
                                </button>
                            )}
                        </GrupoCampo>

                        <GrupoCampo>
                            <label htmlFor="email">E-mail:</label>
                            <p>{usuario?.email ?? ""}</p>
                        </GrupoCampo>

                        <GrupoCampo>
                            <label htmlFor="perfil">Perfil:</label>
                            <p>{usuario?.perfil === "administrador" ? "Administrador" : "Cliente"}</p>
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
                                    value={senha}
                                    onChange={(event) => setSenha(event.target.value)}
                                />

                                <button
                                    type="button"
                                    onClick={() => setMostrarSenhaAtual((valor) => !valor)}
                                    className="icone-senha"
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
                                    value={senhaNova}
                                    onChange={(event) => setSenhaNova(event.target.value)}
                                />

                                <button
                                    type="button"
                                    onClick={() => setMostrarSenhaNova((valor) => !valor)}
                                    className="icone-senha"
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
                                    value={confirmarSenha}
                                    onChange={(event) => setConfirmarSenha(event.target.value)}
                                />

                                <button
                                    type="button"
                                    onClick={() => setMostrarConfirmarSenha((valor) => !valor)}
                                    className="icone-senha"
                                >
                                    {mostrarConfirmarSenha ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </GrupoCampo>

                        <BotaoGeral
                            texto="Salvar"
                            width="100%"
                            padding="15px"
                            margin="28px 0"
                            onClick={atualizarSenha}
                        />
                    </PainelPerfil>
                </GridPerfil>
            </Conteudo>
        </ContainerPagina>
    );
}

export default Perfil;