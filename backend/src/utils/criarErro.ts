export function criarErro(mensagem: string, status: number) {
    const error = new Error(mensagem);
    Object.assign(error, { status });
    return error;
}