import db from "../configs/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface Usuario extends RowDataPacket {
    id: number;
    nome: string;
    email: string;
    senha: string;
    perfil: 'cliente' | 'administrador';
    criado_em: Date;
}

interface DadosAtualizacao {
    nome?: string;
    senha?: string;
}

const UsuarioRepository = {

    async Cadastrar(nome: string, email: string, senha: string): Promise<ResultSetHeader> {
        const [resultado] = await db.execute<ResultSetHeader>(`
            INSERT INTO usuario (nome, email, senha, perfil)
            VALUES (?, ?, ?, ?);
        `, [nome, email, senha, 'cliente']);

        return resultado;
    },

    async BuscarPorEmail(email: string): Promise<Usuario | null> {
        const [resultado] = await db.execute<Usuario[]>(`
            SELECT id, nome, email, senha, perfil
            FROM usuario
            WHERE email = ?;
        `, [email]);

        return resultado[0] ?? null;
    },

    async BuscarPorId(id: number): Promise<Usuario | null> {
        const [resultado] = await db.execute<Usuario[]>(`
            SELECT id, nome, email, senha, perfil, criado_em
            FROM usuario
            WHERE id = ?;
        `, [id]);

        return resultado[0] ?? null;
    },

    async Atualizar(id: number, dados: DadosAtualizacao): Promise<ResultSetHeader | undefined> {
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

        const [resultado] = await db.execute<ResultSetHeader>(`
            UPDATE usuario
            SET ${campos.join(", ")}
            WHERE id = ?;
        `, valores);

        return resultado;
    },

};

export default UsuarioRepository;