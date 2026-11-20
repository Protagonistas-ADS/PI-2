import AdminRepository from "../repositories/admin.repository";

// A partir de quantas unidades o produto aparece como "estoque baixo" no painel
export const LIMITE_ESTOQUE_BAIXO = 10;

const AdminService = {

    // Números do painel: as consultas são independentes, então rodam juntas
    async BuscarResumo() {
        const [pendentes, retirar_hoje, estoque_baixo, vendas_mes] = await Promise.all([
            AdminRepository.ContarPendentes(),
            AdminRepository.ContarRetirarHoje(),
            AdminRepository.ListarEstoqueBaixo(LIMITE_ESTOQUE_BAIXO),
            AdminRepository.SomarVendasDoMes()
        ]);

        return {
            pendentes,
            retirar_hoje,
            limite_estoque_baixo: LIMITE_ESTOQUE_BAIXO,
            estoque_baixo: estoque_baixo.map((produto) => ({
                id: produto.id,
                nome: produto.nome,
                quantidade_estoque: Number(produto.quantidade_estoque)
            })),
            vendas_mes
        };
    }
};

export default AdminService;
