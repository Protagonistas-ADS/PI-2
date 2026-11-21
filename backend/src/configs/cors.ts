import type { CorsOptions } from "cors";

import { criarErro } from "../utils/criarErro";

// Endereços do site que podem chamar a API pelo navegador.
// Vêm do .env (CORS_ORIGIN), separados por vírgula. Sem nada no .env, vale só o Vite local.
const ENDERECO_PADRAO = "http://localhost:5173";

export const origensPermitidas = (process.env.CORS_ORIGIN || ENDERECO_PADRAO)
    .split(",")
    .map((endereco) => endereco.trim().replace(/\/$/, ""))
    .filter(Boolean);

export const opcoesCors: CorsOptions = {
    origin(origem, responder) {
        // Sem "Origin" = não veio de outro site no navegador (ex.: Postman, curl, o próprio servidor).
        // Quem protege essas chamadas é o login (JWT), não o CORS.
        if (!origem || origensPermitidas.includes(origem)) {
            return responder(null, true);
        }

        // Outro site tentando usar a API pelo navegador: barra com 403 no formato de erro da API
        return responder(criarErro("Acesso não permitido a partir deste endereço.", 403));
    },
};
