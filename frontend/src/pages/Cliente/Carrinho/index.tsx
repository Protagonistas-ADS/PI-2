import { useState, useEffect, type SyntheticEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2, FiShoppingCart, FiArrowLeft } from "react-icons/fi";

import { listar } from "../../../services/produtoApi";
import { buscarUsuarioLogado } from "../../../services/usuarioApi";
import { criarPedido } from "../../../services/pedidoApi";
import { useCarrinho } from "../../../hooks/useCarrinho";
import { formatarPreco, urlImagemProduto, usarImagemPadrao, QUANTIDADE_MAXIMA_ITEM } from "../../../utils/produto";
import { obterMensagemErro } from "../../../utils/obterMensagemErro";
import { guardarDestinoAposLogin, sairDaConta } from "../../../utils/destinoAposLogin";
import { dadosEmpresa } from "../../../utils/dadosEmpresa";
import { swalAviso, swalErro, swalSucesso } from "../../../utils/alertas";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

import {
    ContainerPagina,
    Conteudo,
    Cabecalho,
    Grade,
    ListaItens,
    Item,
    Resumo,
    CarrinhoVazio,
} from "./style";

// Mesmos limites que o backend confere (schemas/pedido.schema.ts)
const DIAS_MAXIMOS_RETIRADA = 60;
const LIMITE_OBSERVACAO = 500;

// Data "AAAA-MM-DD" no horário do navegador (o <input type="date"> usa esse formato)
function dataLocal(dias = 0) {
    const data = new Date();
    data.setDate(data.getDate() + dias);

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

type Perfil = "visitante" | "cliente" | "administrador";

// Página do carrinho: revisar itens, escolher a data de retirada e enviar o pedido.
// Qualquer pessoa vê o carrinho; para finalizar é preciso entrar como cliente.
function Carrinho() {
    const carrinho = useCarrinho();
    const [perfil, setPerfil] = useState<Perfil>("visitante");
    const [previsaoBusca, setPrevisaoBusca] = useState("");
    const [observacao, setObservacao] = useState("");
    const [enviando, setEnviando] = useState(false);
    const navigate = useNavigate();

    // Descobre quem está usando a página (o menu e o botão mudam)
    useEffect(() => {
        if (!localStorage.getItem("token")) return;

        buscarUsuarioLogado()
            .then((usuario) => setPerfil(usuario?.perfil === "administrador" ? "administrador" : "cliente"))
            .catch(() => localStorage.removeItem("token"));
    }, []);

    // Ao abrir: começa do topo e atualiza preços e disponibilidade com o catálogo de agora
    useEffect(() => {
        window.scrollTo(0, 0);

        listar()
            .then((produtos) => {
                const avisos = carrinho.sincronizar(produtos);

                if (avisos.length > 0) {
                    swalAviso(avisos.join("\n"));
                }
            })
            .catch(() => {
                // Sem conexão: mostra o carrinho salvo; o backend confere tudo ao enviar
            });
        // Roda só uma vez, ao abrir a página
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleLogout() {
        sairDaConta();
        setPerfil("visitante");
    }

    async function irParaLogin() {
        await swalAviso("Entre na sua conta (ou crie uma) para finalizar o pedido. Seu carrinho fica guardado.");
        guardarDestinoAposLogin("/carrinho");
        navigate("/login");
    }

    // Validação para ajudar o cliente; o backend confere tudo de novo
    function validarFormulario() {
        if (previsaoBusca) {
            if (previsaoBusca < dataLocal()) return "A data de retirada não pode ser no passado.";
            if (previsaoBusca > dataLocal(DIAS_MAXIMOS_RETIRADA)) {
                return `A data de retirada deve ser em até ${DIAS_MAXIMOS_RETIRADA} dias.`;
            }
        }

        if (observacao.trim().length > LIMITE_OBSERVACAO) {
            return `A observação deve ter no máximo ${LIMITE_OBSERVACAO} caracteres.`;
        }

        return "";
    }

    async function handleFinalizar(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        if (perfil === "visitante") {
            await irParaLogin();
            return;
        }

        const erro = validarFormulario();

        if (erro) {
            swalAviso(erro);
            return;
        }

        setEnviando(true);

        try {
            const pedidoId = await criarPedido({
                itens: carrinho.itens.map((item) => ({
                    produto_id: item.produto.id,
                    quantidade: item.quantidade
                })),
                previsao_busca: previsaoBusca || null,
                observacao: observacao.trim() || null
            });

            carrinho.limpar();

            await swalSucesso(
                `Pedido nº ${pedidoId} enviado! A loja vai conferir o estoque e confirmar. ` +
                "Acompanhe o andamento em Meus Pedidos."
            );

            navigate("/clientePedidos");
        } catch (error) {
            swalErro(obterMensagemErro(error, "Não foi possível enviar o pedido. Tente novamente."));

            // Estoque ou produto mudou: atualiza o carrinho com os dados de agora
            listar().then(carrinho.sincronizar).catch(() => { });
        } finally {
            setEnviando(false);
        }
    }

    const linksNavegacao = perfil === "visitante"
        ? [
            { id: 1, texto: "Catálogo", href: "/catalogo", ativo: false },
            { id: 2, texto: "Entrar", href: "/login", ativo: false, aoClicar: () => guardarDestinoAposLogin("/carrinho") },
            { id: 3, texto: "Criar Conta", href: "/cadastro", ativo: false, aoClicar: () => guardarDestinoAposLogin("/carrinho") },
        ]
        : perfil === "administrador"
            ? [
                { id: 1, texto: "Catálogo", href: "/catalogo", ativo: false },
                { id: 2, texto: "Painel", href: "/admin", ativo: false },
                { id: 4, texto: "Sair", href: "/carrinho", ativo: false, aoClicar: handleLogout },
            ]
            : [
                { id: 1, texto: "Catálogo", href: "/catalogo", ativo: false },
                { id: 2, texto: "Meus Pedidos", href: "/clientePedidos", ativo: false },
                { id: 3, texto: "Perfil", href: "/perfil", ativo: false },
                { id: 4, texto: "Sair", href: "/carrinho", ativo: false, aoClicar: handleLogout },
            ];

    return (
        <ContainerPagina>
            <Navbar linkLogo={perfil === "visitante" ? "/" : "/catalogo"} links={linksNavegacao} />

            <Conteudo>
                <Cabecalho>
                    <Link to="/catalogo" className="voltar">
                        <FiArrowLeft /> Continuar comprando
                    </Link>
                    <h1>Meu carrinho</h1>
                    <p>Revise os produtos, escolha quando quer retirar e envie o pedido para a loja.</p>
                </Cabecalho>

                {carrinho.itens.length === 0 ? (
                    <CarrinhoVazio>
                        <FiShoppingCart size={48} />
                        <h2>Seu carrinho está vazio</h2>
                        <p>Escolha os paletes no catálogo e eles aparecem aqui.</p>
                        <Link to="/catalogo" className="botao-principal">Ver catálogo</Link>
                    </CarrinhoVazio>
                ) : (
                    <Grade>
                        <ListaItens aria-label="Produtos no carrinho">
                            {carrinho.itens.map((item) => (
                                <Item key={item.produto.id}>
                                    <img
                                        src={urlImagemProduto(item.produto.imagem)}
                                        alt={item.produto.nome}
                                        onError={usarImagemPadrao}
                                    />

                                    <div className="info">
                                        <h3>{item.produto.nome}</h3>
                                        <span className="preco-unitario">
                                            {formatarPreco(item.produto.preco_unitario)} cada
                                        </span>
                                    </div>

                                    <div className="quantidade">
                                        <button
                                            type="button"
                                            onClick={() => carrinho.diminuir(item.produto.id)}
                                            aria-label={`Diminuir quantidade de ${item.produto.nome}`}
                                        >
                                            <FiMinus />
                                        </button>
                                        <span aria-live="polite">{item.quantidade}</span>
                                        <button
                                            type="button"
                                            onClick={() => carrinho.aumentar(item.produto.id)}
                                            disabled={item.quantidade >= QUANTIDADE_MAXIMA_ITEM}
                                            aria-label={`Aumentar quantidade de ${item.produto.nome}`}
                                        >
                                            <FiPlus />
                                        </button>
                                    </div>

                                    <strong className="subtotal">
                                        {formatarPreco(item.produto.preco_unitario * item.quantidade)}
                                    </strong>

                                    <button
                                        type="button"
                                        className="remover"
                                        onClick={() => carrinho.remover(item.produto.id)}
                                        aria-label={`Remover ${item.produto.nome} do carrinho`}
                                    >
                                        <FiTrash2 /> Remover
                                    </button>
                                </Item>
                            ))}
                        </ListaItens>

                        <Resumo onSubmit={handleFinalizar}>
                            <h2>Resumo do pedido</h2>

                            <div className="linha">
                                <span>Itens</span>
                                <span>{carrinho.totalItens}</span>
                            </div>
                            <div className="linha total">
                                <span>Total</span>
                                <span>{formatarPreco(carrinho.valorTotal)}</span>
                            </div>

                            {perfil === "administrador" ? (
                                <p className="aviso">
                                    Você está logado como administrador. Pedidos são feitos por contas de cliente.
                                </p>
                            ) : (
                                <>
                                    <label htmlFor="previsao_busca">
                                        Quando pretende retirar? <small>(opcional)</small>
                                    </label>
                                    <input
                                        id="previsao_busca"
                                        type="date"
                                        value={previsaoBusca}
                                        min={dataLocal()}
                                        max={dataLocal(DIAS_MAXIMOS_RETIRADA)}
                                        onChange={(event) => setPrevisaoBusca(event.target.value)}
                                    />

                                    <label htmlFor="observacao">
                                        Observação para a loja <small>(opcional)</small>
                                    </label>
                                    <textarea
                                        id="observacao"
                                        rows={4}
                                        maxLength={LIMITE_OBSERVACAO}
                                        placeholder="Ex.: vou buscar com caminhão no fim da tarde."
                                        value={observacao}
                                        onChange={(event) => setObservacao(event.target.value)}
                                    />
                                    <small className="contador">
                                        {observacao.length}/{LIMITE_OBSERVACAO}
                                    </small>

                                    <p className="info-retirada">
                                        A retirada é feita na loja ({dadosEmpresa.endereco.exibicao}).
                                        Depois de enviar, a loja confere o estoque e confirma o pedido.
                                    </p>

                                    <button type="submit" className="botao-principal" disabled={enviando}>
                                        {enviando
                                            ? "Enviando..."
                                            : perfil === "visitante" ? "Entrar para finalizar" : "Enviar pedido"}
                                    </button>
                                </>
                            )}
                        </Resumo>
                    </Grade>
                )}
            </Conteudo>

            <Footer linkLogo={perfil === "visitante" ? "/" : "/catalogo"} />
        </ContainerPagina>
    );
}

export default Carrinho;
