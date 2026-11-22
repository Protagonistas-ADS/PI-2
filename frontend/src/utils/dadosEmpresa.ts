// Dados oficiais da empresa em um só lugar.
// Se algo mudar (telefone, e-mail, endereço, horário), basta alterar aqui.

const enderecoCompleto = "R. Batalha do Tuiuti, 1850 - Distrito Industrial, Salto - SP, 13329-422";

// Texto usado para localizar a loja no Google Maps (link e mapa da landing).
const enderecoMapa = "R. Batalha do Tuiuti, 1850 - Distrito Industrial, Salto - SP, 13329-422";

export const dadosEmpresa = {
    nomeFantasia: "S FERRARETTO",
    nomeExibicao: "S Ferraretto", // para usar no meio de frases

    razaoSocial: "Ferraretto Comércio e Consultoria Empresarial LTDA",
    cnpj: "30.669.871/0001-63",
    email: "ferrarettoconsultoria@gmail.com",
    horario: "Segunda a sexta, das 7h às 18h",
    whatsapp: {
        exibicao: "(11) 97216-7974",
        link: "https://wa.me/5511972167974",
    },
    endereco: {
        exibicao: enderecoCompleto,
        cidade: "Salto-SP",
        linkMapa: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoMapa)}`,
        // Mapa embutido (sem chave de API). Só carrega quando a pessoa rola até ele.
        mapaEmbutido: `https://www.google.com/maps?q=${encodeURIComponent(enderecoMapa)}&output=embed`,
    },
};
