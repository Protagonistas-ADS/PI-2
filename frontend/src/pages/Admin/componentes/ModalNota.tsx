import { useEffect, useState, type FormEvent } from "react";
import { FiX } from "react-icons/fi";

import ModalBase from "../../../components/Modais/ModalBase";

import { registrarNota } from "../../../services/notaApi";
import type { Venda } from "../../../types/venda";

import { obterMensagemErro } from "../../../utils/obterMensagemErro";
import { formatarPreco } from "../../../utils/produto";
import { toastSucesso } from "../../../utils/alertas";
import { erroNumeroNota } from "../../../utils/notaFiscal";

import { FormularioAdmin, CabecalhoJanela } from "../style";

// Janela para registrar a nota substituta de uma venda cuja nota foi cancelada
// (só número e natureza da operação; os produtos e o valor vêm da venda).
interface ModalNotaProps {
    venda: Venda;
    aoFechar: () => void;
    aoSalvar: () => void; // chamado depois de salvar (para recarregar a lista)
}

const NATUREZA_PADRAO = "Venda de mercadoria";

function ModalNota({ venda, aoFechar, aoSalvar }: ModalNotaProps) {
    const [numero, setNumero] = useState("");
    const [natureza, setNatureza] = useState(NATUREZA_PADRAO);
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

    const avisoNumero = tentouEnviar ? erroNumeroNota(numero) : "";

    async function enviar(evento: FormEvent) {
        evento.preventDefault();
        setTentouEnviar(true);
        setErroServidor("");

        if (erroNumeroNota(numero)) return;

        setSalvando(true);

        try {
            await registrarNota({
                venda_id: venda.id,
                numero: numero.trim(),
                natureza_operacao: natureza.trim() || null
            });
            toastSucesso(`Nota ${numero.trim()} registrada para a venda nº ${venda.id}.`);

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
                    <h2 id="titulo-janela-nota">Emitir nota substituta da venda nº {venda.id}</h2>
                    <p>
                        Pedido nº {venda.pedido_id} · {venda.cliente_nome} · {formatarPreco(venda.valor_total)}
                    </p>
                </div>
                <button type="button" onClick={aoFechar} disabled={salvando} aria-label="Fechar">
                    <FiX />
                </button>
            </CabecalhoJanela>

            <FormularioAdmin onSubmit={enviar} noValidate aria-labelledby="titulo-janela-nota">
                <p className="dica">
                    A nota anterior desta venda foi cancelada. Emita a nota substituta no Emitte e registre aqui o número.
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

                {erroServidor && <p className="erro" role="alert">{erroServidor}</p>}

                <div className="acoes-formulario">
                    <button type="button" className="botao-voltar" onClick={aoFechar} disabled={salvando}>
                        Voltar
                    </button>
                    <button type="submit" className="botao-principal" disabled={salvando}>
                        {salvando ? "Salvando..." : "Registrar nota"}
                    </button>
                </div>
            </FormularioAdmin>
        </ModalBase>
    );
}

export default ModalNota;
