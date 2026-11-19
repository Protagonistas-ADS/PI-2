import api from "./api";

export async function listar() {
    const response = await api.get("/produtos");
    return response.data.produtos;
}