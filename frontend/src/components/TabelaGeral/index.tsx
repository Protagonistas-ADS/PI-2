
import React from "react";
import { 
    TabelaContainer, 
    Tabela, 
    Titulo, 
    Cabecalho, 
    Celula, 
    Linha 
} from "./style";

interface Coluna {
    titulo: string;
    chave: string;
    renderizar?: (valor: any, registro: any) => React.ReactNode;
}

interface TabelaGeralProps {
    titulo: string;
    colunas: Coluna[];
    dados: any[];
}

export default function TabelaGeral({
    titulo,
    colunas,
    dados
}: TabelaGeralProps) {
    return (
        <TabelaContainer>
            <Titulo>{titulo}</Titulo>

            <Tabela>
                <thead>
                    <Linha>
                        {colunas.map((coluna) => (
                            <Cabecalho key={coluna.chave}>
                                {coluna.titulo}
                            </Cabecalho>
                        ))}
                    </Linha>
                </thead>

                <tbody>
                    {dados.map((registro, indice) => (
                        <Linha key={registro.id ?? indice}>
                            {colunas.map((coluna) => {
                                const valor = registro[coluna.chave];

                                return (
                                    <Celula key={coluna.chave}>
                                        {coluna.renderizar
                                            ? coluna.renderizar(valor, registro)
                                            : valor ?? "-"}
                                    </Celula>
                                );
                            })}
                        </Linha>
                    ))}

                    {dados.length === 0 && (
                        <Linha>
                            <Celula colSpan={colunas.length}>
                                Nenhum registro encontrado.
                            </Celula>
                        </Linha>
                    )}
                </tbody>
            </Tabela>
        </TabelaContainer>
    );
}
