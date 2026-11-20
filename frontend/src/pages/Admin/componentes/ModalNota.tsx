import { useEffect, useState, type FormEvent } from "react";
import { FiX } from "react-icons/fi";

import ModalBase from "../../../components/Modais/ModalBase";

import { registrarNota, atualizarLinkNota } from "../../../services/notaApi";
import type { Venda } from "../../../types/venda";
import type { NotaFiscal } from "../../../types/nota";

import { obterMensagemErro } from "../../../utils/obterMensagemErro";
import { formatarPreco } from "../../../utils/produto";
import { toastSucesso } from "../../../utils/alertas";

import { FormularioAdmin, CabecalhoJanela } from "../style";

// "emitir": registrar a nota de uma venda (número, natureza, link)
// "link": trocar ou apagar o link do PDF de uma nota emitida
type ModoJanela =
    | { tipo: "emitir"; venda: Venda }
    | { tipo: "link"; nota: NotaFiscal };

interface ModalNotaProps {
    modo: ModoJanela;
    aoFechar: () => void;
    aoSalvar: () => void; // chamado depois de salvar (para recarregar a lista)
}

const NATUREZA_PADRAO = "Venda de mercadoria";

// As mesmas regras do backend (que confere de novo: é ele que protege de verdade)
function erroNumero(numero: string) {
    if (!numero.trim()) return "Informe o número da nota fiscal.";
    if (numero.trim().length > 30) return "O número deve ter no máximo 30 caracteres.";
    if (!/^[A-Za-z0-9./-]+$/.test(numero.trim())) return "Use só letras, números, ponto, barra ou hífen.";
    return "";
}

function erroLink(link: string) {
    if (!link.trim()) return "";

    try {
        const endereco = new URL(link.trim());
        if (endereco.protocol === "http:" || endereco.protocol === "https:") return "";
    } catch {
        // cai no aviso abaixo
    }

    return "Informe um link válido, começando com http:// ou https://.";
}

function ModalNota({ modo, aoFechar, aoSalvar }: ModalNotaProps) {
    const [numero, setNumero] = useState("");
    const [natureza, setNatureza] = useState(NATUREZA_PADRAO);
    const [link, setLink] = useState(modo.tipo === "link" ? modo.nota.link_pdf ?? "" : "");
    const [tentouEnviar, setTentouEnviar] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erroServidor, setErroServidor] = useState("");

    // Esc fecha a janela (se não estiver salvando)
    useEffect(() => {
        function aoTeclar(evento: KeyboardEvent) {
            if (evento.key === "Escape" && !salvando) aoFechar();
        }

        window.addEventListener("keydown", aoTeclar);
        return () => window.removeEventListener("keydown", aoTeclar);
    }, [aoFechar, salvando]);

    const avisoNumero = modo.tipo === "emitir" && tentouEnviar ? erroNumero(numero) : "";
    const avisoLink = tentouEnviar ? erroLink(link) : "";

    async function enviar(evento: FormEvent) {
        evento.preventDefault();
        setTentouEnviar(true);
        setErroServidor("");

        if ((modo.tipo === "emitir" && erroNumero(numero)) || erroLink(link)) return;

        setSalvando(true);

        try {
            if (modo.tipo === "emitir") {
                await registrarNota({
                    venda_id: modo.venda.id,
                    numero: numero.trim(),
                    natureza_operacao: natureza.trim() || null,
                    link_pdf: link.trim() || null
                });
                toastSucesso(`Nota ${numero.trim()} registrada para a venda nº ${modo.venda.id}.`);
            } else {
                await atualizarLinkNota(modo.nota.id, link.trim() || null);
                toastSucesso(link.trim() ? `Link da nota ${modo.nota.numero} salvo.` : `Link da nota ${modo.nota.numero} apagado.`);
            }

            aoSalvar();
            aoFechar();
        } catch (error) {
            setErroServidor(obterMensagemErro(error, "Não foi possível salvar a nota fiscal."));
        } finally {
            setSalvando(false);
        }
    }

    return (
        <ModalBase aoFechar={() => { if (!salvando) aoFechar(); }} larguraMaxima={560}>
            <CabecalhoJanela>
                <div>
                    {modo.tipo === "emitir" ? (
                        <>
                            <h2 id="titulo-janela-nota">Emitir nota da venda nº {modo.venda.id}</h2>
                            <p>
                                Pedido nº {modo.venda.pedido_id} · {modo.venda.cliente_nome} ·{" "}
                                {formatarPreco(modo.venda.valor_total)}
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 id="titulo-janela-nota">Link da nota {modo.nota.numero}</h2>
                            <p>Cole o endereço do PDF da nota no Emitte. Deixe vazio para apagar o link.</p>
                        </>
                    )}
                </div>
                <button type="button" onClick={aoFechar} disabled={salvando} aria-label="Fechar">
                    <FiX />
                </button>
            </CabecalhoJanela>

            <FormularioAdmin onSubmit={enviar} noValidate aria-labelledby="titulo-janela-nota">
                {modo.tipo === "emitir" && (
                    <>
                        <p className="dica">
                            Emita a nota no Emitte e registre aqui o número e o link do PDF.
                            Os produtos e o valor vêm da venda.
                        </p>
                        <div className="linha">
                            <label>
                                Número da nota *
                                <input
                                    value={numero}
                                    onChange={(evento) => setNumero(evento.target.value)}
                                    placeholder="Ex.: NF-000123"
                                    maxLength={30}
                                    autoFocus
                                    aria-invalid={avisoNumero ? true : undefined}
                                />
                                {avisoNumero && <span className="erro">{avisoNumero}</span>}
                            </label>
                            <label>
                                Natureza da operação
                                <input
                                    value={natureza}
                                    onChange={(evento) => setNatureza(evento.target.value)}
                                    maxLength={100}
                                />
                            </label>
                        </div>
                    </>
                )}

                <label>
                    <span>
                        Link do PDF no Emitte {modo.tipo === "emitir" && <span className="dica">(opcional)</span>}
                    </span>
                    <input
                        type="url"
                        value={link}
                        onChange={(evento) => setLink(evento.target.value)}
                        placeholder="https://..."
                        maxLength={500}
                        autoFocus={modo.tipo === "link"}
                        aria-invalid={avisoLink ? true : undefined}
                    />
                    {avisoLink && <span className="erro">{avisoLink}</span>}
                </label>

                {erroServidor && <p className="erro" role="alert">{erroServidor}</p>}

                <div className="acoes-formulario">
                    <button type="button" className="botao-voltar" onClick={aoFechar} disabled={salvando}>
                        Voltar
                    </button>
                    <button type="submit" className="botao-principal" disabled={salvando}>
                        {salvando ? "Salvando..." : modo.tipo === "emitir" ? "Registrar nota" : "Salvar link"}
                    </button>
                </div>
            </FormularioAdmin>
        </ModalBase>
    );
}

export default ModalNota;
