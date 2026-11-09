import db from "../configs/db";
import { RowDataPacket } from "mysql2";

interface Usuario extends RowDataPacket{
    id: number;
    nome: string;
    email: string;
    senha: string;
    tipo: 'cliente' | 'administrador';
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
    }
}

export default UsuarioRepository;