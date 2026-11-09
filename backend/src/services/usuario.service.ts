import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
    },

    async Login(email: string, senha: string) {
        const usuario = await UsuarioRepository.BuscarPorEmail(email);

        if (!usuario) {
            throw criarErro("E-mail ou senha inválidos.", 401);
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            throw criarErro("E-mail ou senha inválidos.", 401);
        }

        const chaveSecreta = process.env.JWT_SECRET;

        if (!chaveSecreta) {
            throw new Error("JWT_SECRET não configurada.");
        }

        const payload = {
            id: usuario.id,
            perfil: usuario.perfil
        };

        const token = jwt.sign(payload, chaveSecreta, {
            expiresIn: "8h"
        });

        return { token, payload };
    }
}

export default UsuarioService;