import bcrypt from "bcrypt";
import UsuarioRepository from "../repositories/usuario.repository";
import { criarErro } from "../utils/criarErro";

const UsuarioService = {
    
    async Cadastrar(nome: string, email: string, senha: string) {
        if (!nome || !email || !senha) {
            throw criarErro("Preencha todos os campos obrigatórios.", 400);
        }

        const usuarioExistente = await UsuarioRepository.BuscarPorEmail(email);

        if (usuarioExistente) {
            throw criarErro("Credenciais já cadastradas", 409);
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        await UsuarioRepository.Cadastrar(nome, email, senhaHash);
    }
}

export default UsuarioService;