import "express";

declare global {
    namespace Express {
        interface Request {
            usuario: {
                id: number;
                nome: string;
                email: string;
                perfil: "cliente" | "administrador";
            };
        }
    }
}

export {};