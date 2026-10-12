import Navbar from "../../components/Navbar";

function TelaInicial() {

    const linksNavegacao = [
        { texto: "Inicio", href: "#inicio", ativo: true },
        { texto: "Produtos", href: "#produtos", ativo: false },
        { texto: "Catálogo", href: "/catalogo", ativo: false},
        { texto: "Contato", href: "#contato", ativo: false},
    ];

    return (
        <>
            <Navbar links={linksNavegacao} />
        </>
    );
}

export default TelaInicial;