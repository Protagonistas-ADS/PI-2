import "express";

declare global {
    namespace Express {
        interface Request {
            usuario: {
                id: number;
                perfil: "cliente" | "administrador";
            };
        }
    }
}

export {};