import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import {
    FiArrowRight,
    FiBriefcase,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiFileText,
    FiMail,
    FiMapPin,
    FiMessageCircle,
    FiPackage,
    FiShoppingCart,
    FiTruck,
} from "react-icons/fi";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { listar } from "../../../services/produtoApi";
import type { Produto } from "../../../types/produto";
import { dadosEmpresa } from "../../../utils/dadosEmpresa";
import { formatarPreco, urlImagemProduto, usarImagemPadrao } from "../../../utils/produto";

import {
    ContainerPagina,
    Conteudo,
    Hero,
    ConteudoHero,
    Selo,
    Botoes,
    BotaoPrincipal,
    BotaoSecundario,
    ListaConfianca,
    Secao,
    ConteudoSecao,
    CabecalhoSecao,
    GradeProdutos,
    CardProduto,
    AvisoProdutos,
    LinkCentral,
    Passos,
    Passo,
    NumeroPasso,
    GradeSobre,
    TextoSobre,
    Diferenciais,
    Diferencial,
    GradeContato,
    ListaContato,
    Mapa,
} from "./style";

const QUANTIDADE_DESTAQUES = 4;

const mensagemWhatsapp = "Olá! Vim pelo site e gostaria de informações sobre paletes.";
const linkWhatsapp = `${dadosEmpresa.whatsapp.link}?text=${encodeURIComponent(mensagemWhatsapp)}`;

const passos = [
    {
        icone: <FiPackage aria-hidden="true" />,
        titulo: "Escolha no catálogo",
        texto: "Veja os modelos, preços e a quantidade disponível. Não precisa de cadastro para olhar.",
    },
    {
        icone: <FiShoppingCart aria-hidden="true" />,
        titulo: "Monte o carrinho",
        texto: "Informe as quantidades, escolha a data em que quer retirar e deixe uma observação, se precisar.",
    },
    {
        icone: <FiCheckCircle aria-hidden="true" />,
        titulo: "Nós confirmamos",
        texto: "Conferimos o estoque e confirmamos o pedido. Você acompanha o status em \"Meus Pedidos\".",
    },
    {
        icone: <FiTruck aria-hidden="true" />,
        titulo: "Retire na loja",
        texto: `Quando o pedido estiver pronto, é só retirar na nossa loja em ${dadosEmpresa.endereco.cidade}.`,
    },
];

type EstadoProdutos = "carregando" | "pronto" | "erro";

function TelaInicial() {
    const [destaques, setDestaques] = useState<Produto[]>([]);
    const [estadoProdutos, setEstadoProdutos] = useState<EstadoProdutos>("carregando");

    const linksNavegacao = [
        { id: 1, texto: "Catálogo", href: "/catalogo", ativo: false },
        { id: 2, texto: "Como funciona", href: "#como-funciona", ativo: false },
        { id: 3, texto: "Contato", href: "#onde-estamos", ativo: false },
        { id: 4, texto: "Entrar", href: "/login", ativo: false },
        { id: 5, texto: "Criar Conta", href: "/cadastro", ativo: false },
    ];

    // Os destaques vêm do banco (GET /produtos, público): se o preço ou a foto
    // mudar no sistema, a landing já mostra o valor novo.
    useEffect(() => {
        let ativo = true;

        listar()
            .then((produtos) => {
                if (!ativo) return;
                setDestaques(produtos.slice(0, QUANTIDADE_DESTAQUES));
                setEstadoProdutos("pronto");
            })
            .catch(() => {
                if (ativo) setEstadoProdutos("erro");
            });

        return () => {
            ativo = false;
        };
    }, []);

    return (
        <ContainerPagina>
            <Navbar linkLogo="/" links={linksNavegacao} />

            <Conteudo>
                <Hero>
                    <ConteudoHero>
                        <Selo>
                            <FiMapPin aria-hidden="true" />
                            {dadosEmpresa.endereco.cidade} · Empresas e pessoas físicas
                        </Selo>

                        <h1>Paletes de madeira e plástico para a sua operação</h1>

                        <p>
                            Consulte os modelos e os preços, faça seu pedido pelo site
                            e retire na nossa loja em {dadosEmpresa.endereco.cidade}.
                        </p>

                        <Botoes>
                            <BotaoPrincipal to="/catalogo">
                                Ver catálogo
                                <FiArrowRight aria-hidden="true" />
                            </BotaoPrincipal>

                            <BotaoSecundario href={linkWhatsapp} target="_blank" rel="noopener noreferrer">
                                <FaWhatsapp aria-hidden="true" />
                                Falar no WhatsApp
                            </BotaoSecundario>
                        </Botoes>

                        <ListaConfianca>
                            <li>
                                <FiFileText aria-hidden="true" />
                                CNPJ {dadosEmpresa.cnpj}
                            </li>
                            <li>
                                <FiMapPin aria-hidden="true" />
                                Retirada na loja
                            </li>
                            <li>
                                <FiClock aria-hidden="true" />
                                {dadosEmpresa.horario}
                            </li>
                        </ListaConfianca>
                    </ConteudoHero>
                </Hero>

                <Secao id="produtos">
                    <ConteudoSecao>
                        <CabecalhoSecao>
                            <h2>Nossos paletes</h2>
                            <p>Preços atualizados direto do nosso sistema.</p>
                        </CabecalhoSecao>

                        {estadoProdutos === "carregando" && (
                            <AvisoProdutos role="status">Carregando produtos...</AvisoProdutos>
                        )}

                        {estadoProdutos === "erro" && (
                            <AvisoProdutos role="alert">
                                Não foi possível carregar os produtos agora. Tente abrir o catálogo
                                ou fale com a gente pelo WhatsApp.
                            </AvisoProdutos>
                        )}

                        {estadoProdutos === "pronto" && destaques.length === 0 && (
                            <AvisoProdutos>
                                Estamos atualizando nosso catálogo. Fale com a gente pelo WhatsApp.
                            </AvisoProdutos>
                        )}

                        {destaques.length > 0 && (
                            <GradeProdutos>
                                {destaques.map((produto) => (
                                    <CardProduto key={produto.id} to="/catalogo">
                                        <img
                                            src={urlImagemProduto(produto.imagem)}
                                            onError={usarImagemPadrao}
                                            alt={produto.nome}
                                            loading="lazy"
                                        />
                                        <div>
                                            <h3>{produto.nome}</h3>
                                            <strong>
                                                {formatarPreco(produto.preco_unitario)}
                                                <span>/ unidade</span>
                                            </strong>
                                        </div>
                                    </CardProduto>
                                ))}
                            </GradeProdutos>
                        )}

                        <LinkCentral to="/catalogo">
                            Ver catálogo completo
                            <FiArrowRight aria-hidden="true" />
                        </LinkCentral>
                    </ConteudoSecao>
                </Secao>

                <Secao id="como-funciona" $fundo="claro">
                    <ConteudoSecao>
                        <CabecalhoSecao>
                            <h2>Como funciona o pedido</h2>
                            <p>Do catálogo até a retirada, em quatro passos.</p>
                        </CabecalhoSecao>

                        <Passos>
                            {passos.map((passo, indice) => (
                                <Passo key={passo.titulo}>
                                    <NumeroPasso aria-hidden="true">{indice + 1}</NumeroPasso>
                                    {passo.icone}
                                    <h3>{passo.titulo}</h3>
                                    <p>{passo.texto}</p>
                                </Passo>
                            ))}
                        </Passos>
                    </ConteudoSecao>
                </Secao>

                <Secao id="sobre" $fundo="escuro">
                    <ConteudoSecao>
                        <GradeSobre>
                            <TextoSobre>
                                <h2>Sobre a {dadosEmpresa.nomeExibicao}</h2>
                                <p>
                                    A {dadosEmpresa.nomeExibicao} é uma empresa de {dadosEmpresa.endereco.cidade} que
                                    fornece paletes de madeira e de plástico para empresas da região e também
                                    atende pessoas físicas.
                                </p>
                                <p>
                                    Nosso foco é simples: o palete certo, na quantidade certa, com retirada
                                    combinada e sem burocracia. Pelo site você consulta os modelos, faz o
                                    pedido e acompanha cada etapa até a retirada.
                                </p>
                            </TextoSobre>

                            <Diferenciais>
                                <Diferencial>
                                    <FiBriefcase aria-hidden="true" />
                                    <div>
                                        <h3>Atendimento para empresas</h3>
                                        <p>Pedidos em quantidade para indústrias, comércios e depósitos.</p>
                                    </div>
                                </Diferencial>
                                <Diferencial>
                                    <FiCalendar aria-hidden="true" />
                                    <div>
                                        <h3>Retirada no dia que você escolher</h3>
                                        <p>Você indica a data no pedido e nós deixamos tudo separado.</p>
                                    </div>
                                </Diferencial>
                                <Diferencial>
                                    <FiMessageCircle aria-hidden="true" />
                                    <div>
                                        <h3>Contato direto</h3>
                                        <p>Dúvidas sobre medidas ou quantidades? Fale com a gente pelo WhatsApp.</p>
                                    </div>
                                </Diferencial>
                            </Diferenciais>
                        </GradeSobre>
                    </ConteudoSecao>
                </Secao>

                <Secao id="onde-estamos">
                    <ConteudoSecao>
                        <CabecalhoSecao>
                            <h2>Onde estamos</h2>
                            <p>Retire seu pedido na nossa loja ou tire suas dúvidas antes de comprar.</p>
                        </CabecalhoSecao>

                        <GradeContato>
                            <ListaContato>
                                <li>
                                    <FiMapPin aria-hidden="true" />
                                    <div>
                                        <strong>Endereço</strong>
                                        <a href={dadosEmpresa.endereco.linkMapa} target="_blank" rel="noopener noreferrer">
                                            {dadosEmpresa.endereco.exibicao}
                                        </a>
                                    </div>
                                </li>
                                <li>
                                    <FiClock aria-hidden="true" />
                                    <div>
                                        <strong>Horário</strong>
                                        <span>{dadosEmpresa.horario}</span>
                                    </div>
                                </li>
                                <li>
                                    <FaWhatsapp aria-hidden="true" />
                                    <div>
                                        <strong>WhatsApp</strong>
                                        <a href={linkWhatsapp} target="_blank" rel="noopener noreferrer">
                                            {dadosEmpresa.whatsapp.exibicao}
                                        </a>
                                    </div>
                                </li>
                                <li>
                                    <FiMail aria-hidden="true" />
                                    <div>
                                        <strong>E-mail</strong>
                                        <a href={`mailto:${dadosEmpresa.email}`}>{dadosEmpresa.email}</a>
                                    </div>
                                </li>
                                <li>
                                    <FiFileText aria-hidden="true" />
                                    <div>
                                        <strong>Empresa</strong>
                                        <span>
                                            {dadosEmpresa.razaoSocial}
                                            <br />
                                            CNPJ {dadosEmpresa.cnpj}
                                        </span>
                                    </div>
                                </li>
                            </ListaContato>

                            <Mapa
                                title={`Mapa: ${dadosEmpresa.endereco.exibicao}`}
                                src={dadosEmpresa.endereco.mapaEmbutido}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </GradeContato>
                    </ConteudoSecao>
                </Secao>
            </Conteudo>

            <Footer linkLogo="/" />
        </ContainerPagina>
    );
}

export default TelaInicial;
