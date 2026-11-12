import { useEffect, useState } from "react";
import BotaoGeral from "../../components/BotaoGeral";
import { buscarUsuarioLogado, atualizarUsuario } from "../../services/usuarioApi";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
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

    const nomeAlterado = nome !== usuario?.nome;

    async function carregarUsuario() {

        try {
            const dados = await buscarUsuarioLogado();
            setUsuario(dados);

            setNome(dados.nome);
        } catch (error) {
            console.error("Erro ao carregar usuário", error);
        }
    }

    function validarSenha() {
        if (!senha || !senhaNova || !confirmarSenha) {
            alert("Preencha todos os campos de senha.");
            return false;
        }

        if (senhaNova !== confirmarSenha) {
            alert("As senhas não coincidem.");
            return false;
        }

        return true;
    }

    async function atualizarDados() {
        if (senhaNova || senha || confirmarSenha) {
            if (!validarSenha()) return;
        }

        const dados: {
            nome?: string;
            senhaAtual?: string;
            senhaNova?: string;
        } = {};

        if (nomeAlterado) {
            dados.nome = nome;
        }

        if (senhaNova) {
            dados.senhaAtual = senha;
            dados.senhaNova = senhaNova;
        }

        if (Object.keys(dados).length === 0) {
            return;
        }

        try {
            await atualizarUsuario(dados);

            await carregarUsuario();

            setSenha("");
            setSenhaNova("");
            setConfirmarSenha("");
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
        }
    }

    useEffect(() => {
        carregarUsuario();
    }, []);

    return (
        <ContainerPagina>
            <Conteudo>
                <CabecalhoPerfil>
                    <BotaoGeral
                        texto="Voltar"
                        destino="/catalogo"
                        icone={<FaArrowLeft />}
                    />
                    <h1>Meu Perfil</h1>
                </CabecalhoPerfil>

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
                                    onClick={atualizarDados}
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
                            <CampoInformacao
                                id="senha"
                                type="password"
                                value={senha}
                                onChange={(event) => setSenha(event.target.value)}
                            />
                        </GrupoCampo>

                        <GrupoCampo>
                            <label htmlFor="senhaNova">Nova Senha:</label>
                            <CampoInformacao
                                id="senhaNova"
                                type="password"
                                value={senhaNova}
                                onChange={(event) => setSenhaNova(event.target.value)}
                            />
                        </GrupoCampo>

                        <GrupoCampo>
                            <label htmlFor="confirmarSenha">Confirmar Nova Senha:</label>
                            <CampoInformacao
                                id="confirmarSenha"
                                type="password"
                                value={confirmarSenha}
                                onChange={(event) => setConfirmarSenha(event.target.value)}
                            />
                        </GrupoCampo>

                        <BotaoGeral
                            texto="Salvar"
                            width="100%"
                            padding="15px"
                            margin="18px 0"
                            onClick={atualizarDados}
                        />
                    </PainelPerfil>
                </GridPerfil>
            </Conteudo>
        </ContainerPagina>
    );
}

export default Perfil;