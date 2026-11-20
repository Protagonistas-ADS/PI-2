import { useCallback, useEffect, useMemo, useState } from "react";
import { FiRefreshCw, FiX } from "react-icons/fi";

import { listarUsuarios } from "../../../services/adminApi";
import type { PerfilUsuario, UsuarioAdmin } from "../../../types/admin";

import { formatarData, normalizarBusca } from "../../../utils/filtrosAdmin";
import { obterMensagemErro } from "../../../utils/obterMensagemErro";
import { formatarPreco } from "../../../utils/produto";

import {
    CabecalhoPagina,
    SecaoAdmin,
    TopoSecao,
    Filtros,
    BotaoFiltro,
    BotaoAtualizar,
    BarraBusca,
    ResumoLista,
    Mensagem,
    RolagemTabela,
    TabelaAdmin
} from "../style";

type FiltroPerfil = "todos" | PerfilUsuario;

const NOME_FILTRO: Record<FiltroPerfil, string> = {
    todos: "Todos",
    cliente: "Clientes",
    administrador: "Administradores"
};

const NOME_PERFIL: Record<PerfilUsuario, string> = {
    cliente: "Cliente",
    administrador: "Administrador"
};

type Ordem = "recentes" | "nome" | "mais_pedidos" | "mais_comprou";

const NOME_ORDEM: Record<Ordem, string> = {
    recentes: "Cadastro mais recente",
    nome: "Nome (A–Z)",
    mais_pedidos: "Mais pedidos",
    mais_comprou: "Maior valor comprado"
};

function ordenar(lista: UsuarioAdmin[], ordem: Ordem) {
    const copia = [...lista];

    switch (ordem) {
        case "nome":
            return copia.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
        case "mais_pedidos":
            return copia.sort((a, b) => b.total_pedidos - a.total_pedidos || a.nome.localeCompare(b.nome, "pt-BR"));
        case "mais_comprou":
            return copia.sort((a, b) => b.total_comprado - a.total_comprado || a.nome.localeCompare(b.nome, "pt-BR"));
        default:
            return copia; // a API já manda do cadastro mais novo para o mais antigo
    }
}

// Tabela de usuários (só consulta: o admin não muda perfil nem desativa contas nesta entrega).
function Usuarios() {
    const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState("");

    const [perfil, setPerfil] = useState<FiltroPerfil>("todos");
    const [busca, setBusca] = useState("");
    const [ordem, setOrdem] = useState<Ordem>("recentes");

    const carregar = useCallback(async () => {
        try {
            setUsuarios(await listarUsuarios());
            setErroCarregamento("");
        } catch (error) {
            setErroCarregamento(obterMensagemErro(error, "Não foi possível carregar os usuários."));
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    const usuariosBuscados = useMemo(() => {
        const termo = normalizarBusca(busca);
        if (!termo) return usuarios;

        return usuarios.filter((usuario) =>
            normalizarBusca(usuario.nome).includes(termo) || normalizarBusca(usuario.email).includes(termo)
        );
    }, [usuarios, busca]);

    const usuariosVisiveis = useMemo(() => {
        const filtrados = perfil === "todos"
            ? usuariosBuscados
            : usuariosBuscados.filter((usuario) => usuario.perfil === perfil);

        return ordenar(filtrados, ordem);
    }, [usuariosBuscados, perfil, ordem]);

    function contar(opcao: FiltroPerfil) {
        return opcao === "todos"
            ? usuariosBuscados.length
            : usuariosBuscados.filter((usuario) => usuario.perfil === opcao).length;
    }

    const temFiltro = perfil !== "todos" || busca.trim() !== "";

    function limparFiltros() {
        setPerfil("todos");
        setBusca("");
        setOrdem("recentes");
    }

    return (
        <>
            <CabecalhoPagina>
                <h1>Usuários</h1>
                <p>Clientes e administradores cadastrados no site, com o resumo das compras de cada um.</p>
            </CabecalhoPagina>

            {carregando && <Mensagem>Carregando os usuários...</Mensagem>}

            {!carregando && erroCarregamento && (
                <Mensagem>
                    <p>{erroCarregamento}</p>
                    <BotaoAtualizar type="button" onClick={() => { setCarregando(true); carregar(); }}>
                        <FiRefreshCw /> Tentar de novo
                    </BotaoAtualizar>
                </Mensagem>
            )}

            {!carregando && !erroCarregamento && (
                <SecaoAdmin>
                    <TopoSecao>
                        <div>
                            <h2>Lista de usuários</h2>
                            <p>"Total comprado" soma só os pedidos entregues.</p>
                        </div>
                        <BotaoAtualizar type="button" onClick={carregar}>
                            <FiRefreshCw /> Atualizar
                        </BotaoAtualizar>
                    </TopoSecao>

                    <BarraBusca className="curta">
                        <label className="busca">
                            Buscar
                            <input
                                type="search"
                                value={busca}
                                onChange={(evento) => setBusca(evento.target.value)}
                                placeholder="Nome ou e-mail"
                                maxLength={100}
                            />
                        </label>
                        <label>
                            Ordenar por
                            <select value={ordem} onChange={(evento) => setOrdem(evento.target.value as Ordem)}>
                                {(Object.keys(NOME_ORDEM) as Ordem[]).map((opcao) => (
                                    <option key={opcao} value={opcao}>{NOME_ORDEM[opcao]}</option>
                                ))}
                            </select>
                        </label>
                        <BotaoAtualizar type="button" onClick={limparFiltros} disabled={!temFiltro && ordem === "recentes"}>
                            <FiX /> Limpar
                        </BotaoAtualizar>
                    </BarraBusca>

                    <Filtros role="group" aria-label="Filtrar usuários por perfil">
                        {(Object.keys(NOME_FILTRO) as FiltroPerfil[]).map((opcao) => (
                            <BotaoFiltro
                                key={opcao}
                                type="button"
                                $ativo={perfil === opcao}
                                aria-pressed={perfil === opcao}
                                onClick={() => setPerfil(opcao)}
                            >
                                {NOME_FILTRO[opcao]} ({contar(opcao)})
                            </BotaoFiltro>
                        ))}
                    </Filtros>

                    {usuariosVisiveis.length === 0 ? (
                        <Mensagem>
                            Nenhum usuário encontrado com esses filtros.
                            {temFiltro && (
                                <BotaoAtualizar type="button" onClick={limparFiltros}>
                                    <FiX /> Limpar filtros
                                </BotaoAtualizar>
                            )}
                        </Mensagem>
                    ) : (
                        <>
                            <ResumoLista aria-live="polite">
                                Mostrando <strong>{usuariosVisiveis.length}</strong> de {usuarios.length}{" "}
                                {usuarios.length === 1 ? "usuário" : "usuários"}
                            </ResumoLista>

                            <RolagemTabela>
                                <TabelaAdmin>
                                    <thead>
                                        <tr>
                                            <th>Usuário</th>
                                            <th>Perfil</th>
                                            <th>Cadastro</th>
                                            <th>Pedidos</th>
                                            <th>Total comprado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuariosVisiveis.map((usuario) => {
                                            const ehCliente = usuario.perfil === "cliente";

                                            return (
                                                <tr key={usuario.id}>
                                                    <td data-rotulo="Usuário" className="cliente">
                                                        <div>
                                                            <strong>{usuario.nome}</strong>
                                                            <span className="detalhe">{usuario.email}</span>
                                                        </div>
                                                    </td>
                                                    <td data-rotulo="Perfil">
                                                        <span className={`status status-${usuario.perfil}`}>
                                                            {NOME_PERFIL[usuario.perfil]}
                                                        </span>
                                                    </td>
                                                    <td data-rotulo="Cadastro">{formatarData(usuario.criado_em) ?? "—"}</td>
                                                    <td data-rotulo="Pedidos">{ehCliente ? usuario.total_pedidos : "—"}</td>
                                                    <td data-rotulo="Total comprado">
                                                        {ehCliente ? formatarPreco(usuario.total_comprado) : "—"}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </TabelaAdmin>
                            </RolagemTabela>
                        </>
                    )}
                </SecaoAdmin>
            )}
        </>
    );
}

export default Usuarios;
