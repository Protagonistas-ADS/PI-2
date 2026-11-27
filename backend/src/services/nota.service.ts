import type { PoolConnection } from "mysql2/promise";
import db from "../configs/db";
import NotaRepository from "../repositories/nota.repository";
import type { NovaNota } from "../schemas/nota.schema";
import { criarErro } from "../utils/criarErro";

// Erro do MySQL quando um valor UNIQUE se repete
// (ex.: dois admins registrando o mesmo número ao mesmo tempo)
function numeroRepetido(erro: unknown) {
    return typeof erro === "object" && erro !== null && "code" in erro && erro.code === "ER_DUP_ENTRY";
}

// Abre uma transação, roda `passo` e confirma; se algo falhar, desfaz tudo
async function emTransacao<T>(passo: (conexao: PoolConnection) => Promise<T>): Promise<T> {
    const conexao = await db.getConnection();

    try {
        await conexao.beginTransaction();
        const resultado = await passo(conexao);
        await conexao.commit();
        return resultado;
    } catch (error) {
        await conexao.rollback();
        throw error;
    } finally {
        conexao.release();
    }
}

// A nota fiscal é emitida no Emitte; o sistema guarda os dados, o status e o link do PDF.
const NotaService = {

    // POST /notas: registra a nota de uma venda (os dados já chegam limpos pelo Zod)
    async Criar(dados: NovaNota) {
        try {
            return await emTransacao(async (conexao) => {
                const venda = await NotaRepository.BuscarVenda(conexao, dados.venda_id);

                if (!venda) {
                    throw criarErro("Venda não encontrada.", 404);
                }

                if (await NotaRepository.VerificarNotaEmitida(conexao, dados.venda_id)) {
                    throw criarErro("Esta venda já possui uma nota fiscal emitida. Cancele-a antes de registrar outra.", 409);
                }

                if (await NotaRepository.VerificarNumeroExistente(conexao, dados.numero)) {
                    throw criarErro(`Já existe uma nota com o número ${dados.numero}.`, 409);
                }

                const itens = await NotaRepository.BuscarItensVenda(conexao, dados.venda_id);

                if (itens.length === 0) {
                    throw criarErro("A venda não possui produtos.", 400);
                }

                // O valor não vai para o banco (atributo derivado); só é devolvido na resposta.
                const valorTotal = itens.reduce(
                    (total, item) => total + Number(item.preco_unitario) * item.quantidade,
                    0
                );

                const resultadoNota = await NotaRepository.Criar(
                    conexao,
                    dados.venda_id,
                    dados.numero,
                    dados.natureza_operacao,
                    dados.link_pdf
                );

                for (const item of itens) {
                    await NotaRepository.CriarItem(conexao, resultadoNota.insertId, item);
                }

                return {
                    nota_id: resultadoNota.insertId,
                    venda_id: dados.venda_id,
                    numero: dados.numero,
                    valor_total: valorTotal,
                    status: "emitida" as const,
                    link_pdf: dados.link_pdf,
                    quantidade_itens: itens.length
                };
            });
        } catch (erro) {
            if (numeroRepetido(erro)) {
                throw criarErro(`Já existe uma nota com o número ${dados.numero}.`, 409);
            }
            throw erro;
        }
    },

    // GET /notas: tabela de notas do painel (o MySQL devolve DECIMAL como texto)
    async Listar() {
        const notas = await NotaRepository.Listar();

        return notas.map((nota) => ({
            id: nota.id,
            venda_id: nota.venda_id,
            pedido_id: nota.pedido_id,
            cliente_nome: nota.cliente_nome,
            numero: nota.numero,
            natureza_operacao: nota.natureza_operacao,
            valor_total: Number(nota.valor_total),
            status: nota.status,
            link_pdf: nota.link_pdf,
            data_emissao: nota.data_emissao
        }));
    },

    // PATCH /notas/:id/cancelar: a nota cancelada fica no histórico e a venda volta a ficar sem nota
    async Cancelar(id: number) {
        return await emTransacao(async (conexao) => {
            const nota = await NotaRepository.BuscarParaAtualizar(conexao, id);

            if (!nota) {
                throw criarErro("Nota fiscal não encontrada.", 404);
            }

            if (nota.status === "cancelada") {
                throw criarErro(`A nota ${nota.numero} já está cancelada.`, 409);
            }

            await NotaRepository.Cancelar(conexao, id);

            return { id, numero: nota.numero, status: "cancelada" as const };
        });
    },

    // PATCH /notas/:id/link: trocar ou apagar o link do PDF (só de nota emitida)
    async AtualizarLink(id: number, linkPdf: string | null) {
        return await emTransacao(async (conexao) => {
            const nota = await NotaRepository.BuscarParaAtualizar(conexao, id);

            if (!nota) {
                throw criarErro("Nota fiscal não encontrada.", 404);
            }

            if (nota.status === "cancelada") {
                throw criarErro(`A nota ${nota.numero} está cancelada e não pode ser alterada.`, 409);
            }

            await NotaRepository.AtualizarLink(conexao, id, linkPdf);

            return { id, link_pdf: linkPdf };
        });
    }
};

export default NotaService;
