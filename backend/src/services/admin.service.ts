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
    },

    // Tabela de usuários do painel (o MySQL devolve contagens e somas como texto: converte)
    async ListarUsuarios() {
        const usuarios = await AdminRepository.ListarUsuarios();

        return usuarios.map((usuario) => ({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            perfil: usuario.perfil,
            criado_em: usuario.criado_em,
            total_pedidos: Number(usuario.total_pedidos),
            total_comprado: Number(usuario.total_comprado)
        }));
    }
};

export default AdminService;
