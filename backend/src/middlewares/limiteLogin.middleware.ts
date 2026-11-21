import { rateLimit } from "express-rate-limit";

// Limite de tentativas de login: depois de 5 tentativas ERRADAS em 15 minutos,
// o mesmo endereço (IP) fica bloqueado até a janela acabar. Logins certos não contam.
const MINUTOS_BLOQUEIO = 15;
const TENTATIVAS_ERRADAS = 5;

export const limiteLogin = rateLimit({
    windowMs: MINUTOS_BLOQUEIO * 60 * 1000,
    limit: TENTATIVAS_ERRADAS,
    skipSuccessfulRequests: true,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            erro: `Muitas tentativas de login. Por segurança, tente novamente em ${MINUTOS_BLOQUEIO} minutos.`,
        });
    },
});

export default limiteLogin;
