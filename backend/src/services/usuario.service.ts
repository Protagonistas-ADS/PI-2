import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UsuarioRepository from "../repositories/usuario.repository";
import { criarErro } from "../utils/criarErro";


interface DadosAtualizacao {
    nome?: string;
    senhaAtual?: string;
    senhaNova?: string;
}

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
    },

    async Atualizar(id: number, dados: DadosAtualizacao) {
        const atualizacao: { nome?: string; senha?: string } = {};

        const usuario = await UsuarioRepository.BuscarPorId(id);

        if (!usuario) {
            throw criarErro("Usuário não encontrado.", 404);
        }

        // Validações do nome
        if (dados.nome !== undefined) {
            const nome = dados.nome.trim();

            if (!nome) {
                throw criarErro("O nome não pode ficar vazio.", 400);
            }

            atualizacao.nome = nome;
        }

        // Validações da senha
        if (dados.senhaAtual !== undefined && dados.senhaNova === undefined) {
            throw criarErro("Informe a nova senha.", 400);
        }

        if (dados.senhaNova !== undefined) {
            if (!dados.senhaAtual) {
                throw criarErro("Informe sua senha atual.", 400);
            }

            if (dados.senhaNova.length < 6) {
                throw criarErro(
                    "A nova senha deve conter ao menos 6 caracteres.",
                    400
                );
            }

            const senhaValida = await bcrypt.compare(
                dados.senhaAtual,
                usuario.senha
            );

            if (!senhaValida) {
                throw criarErro("Senha atual incorreta.", 401);
            }

            atualizacao.senha = await bcrypt.hash(dados.senhaNova, 10);
        }

        if (Object.keys(atualizacao).length === 0) {
            throw criarErro("Nenhum dado para atualizar.", 400);
        }

        await UsuarioRepository.Atualizar(id, atualizacao);
    },
}

export default UsuarioService;