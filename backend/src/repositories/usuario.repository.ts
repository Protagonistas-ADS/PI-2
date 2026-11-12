import db from "../configs/db";
import { RowDataPacket } from "mysql2";

interface Usuario extends RowDataPacket {
    id: number;
    nome: string;
    email: string;
    senha: string;
    perfil: 'cliente' | 'administrador';
}

interface DadosAtualizacao {
    nome?: string;
    senha?: string;
}


const UsuarioRepository = {

    async Cadastrar(nome: string, email: string, senha: string) {
        await db.execute(`
            INSERT INTO usuario (nome, email, senha, perfil)
            VALUES (?, ?, ?, ?)   
        `, [nome, email, senha, 'cliente']);
    },

    async BuscarPorEmail(email: string): Promise<Usuario | null> {
        const [resultado] = await db.execute<Usuario[]>(`
            SELECT id, nome, email, senha, perfil
            FROM usuario
            WHERE email = ?
        `, [email]);

        return resultado[0] ?? null;
    },

    async BuscarPorId(id: number): Promise<Usuario | null> {
        const [resultado] = await db.execute<Usuario[]>(`
            SELECT id, nome, email, senha, perfil
            FROM usuario
            WHERE id = ?
        `, [id]);

        return resultado[0] ?? null;
    },

    async Atualizar(id: number, dados: DadosAtualizacao): Promise<void> {
        const campos = [];
        const valores = [];

        if (dados.nome !== undefined) {
            campos.push("nome = ?");
            valores.push(dados.nome);
        }

        if (dados.senha !== undefined) {
            campos.push("senha = ?");
            valores.push(dados.senha);
        }

        if (campos.length === 0) return;

        valores.push(id);

        await db.execute(`
            UPDATE usuario
            SET ${campos.join(", ")}
            WHERE id = ?
        `, valores);
    },
}

export default UsuarioRepository;