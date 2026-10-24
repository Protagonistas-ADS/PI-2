import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function Catalogo() {


    const linksNavegacao = [
        { id: 1, texto: "Catálogo", href: "/catalogo", ativo: true },
        { id: 3, texto: "Home", href: "/", ativo: false },
        { id: 4, texto: "Contatos", href: "#contatos", ativo: false },
    ];



    return (
        <>
            <Navbar links={linksNavegacao} />
            <Footer />
        </>
    )
}

export default Catalogo;