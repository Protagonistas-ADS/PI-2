// Dados oficiais da empresa em um só lugar.
// Se algo mudar (telefone, e-mail, endereço), basta alterar aqui.

const enderecoCompleto = "R. José de Alencar, 7 - Vila Progresso, Salto - SP";

export const dadosEmpresa = {
    nomeFantasia: "S FERRARETTO",
    razaoSocial: "Ferraretto Comércio e Consultoria Empresarial LTDA",
    cnpj: "30.669.871/0001-63",
    email: "ferrarettoconsultoria@gmail.com",
    whatsapp: {
        exibicao: "(11) 96499-2626",
        link: "https://wa.me/5511964992626",
    },
    endereco: {
        exibicao: enderecoCompleto,
        linkMapa: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoCompleto)}`,
    },
};
