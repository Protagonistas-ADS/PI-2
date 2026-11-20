-- =====================================================================
-- MIGRAÇÃO: novo fluxo de status do pedido + observação do cliente
-- =====================================================================
-- Para quem JÁ TEM o banco PI2 criado com o schema antigo.
-- (Quem for criar o banco do zero só precisa rodar schema.sql + seed.sql.)
--
-- O que muda:
--   - O status 'respondido' (sobra da cotação) deixa de existir.
--     Pedidos 'respondido' passam a 'confirmado'.
--   - Novos status: 'confirmado' e 'pronto_retirada'.
--   - Nova coluna pedido.observacao (recado do cliente, opcional).
--
-- Atenção: pedidos antigos convertidos para 'confirmado' NÃO baixam o
-- estoque (a baixa só acontece quando o admin confirma pelo sistema).
-- Não apaga nenhum pedido.
-- Rode UMA vez (a coluna observacao não pode ser criada duas vezes).
-- =====================================================================

USE PI2;

SET SQL_SAFE_UPDATES = 0;

-- 1. Aceita os status antigos e novos ao mesmo tempo (passo intermediário)
ALTER TABLE pedido
    MODIFY status ENUM('pendente','respondido','confirmado','pronto_retirada','entregue','cancelado')
    NOT NULL DEFAULT 'pendente';

-- 2. Converte 'respondido' em 'confirmado'
UPDATE pedido SET status = 'confirmado' WHERE status = 'respondido';

-- 3. Remove 'respondido' da lista de status
ALTER TABLE pedido
    MODIFY status ENUM('pendente','confirmado','pronto_retirada','entregue','cancelado')
    NOT NULL DEFAULT 'pendente';

-- 4. Observação do cliente
ALTER TABLE pedido
    ADD COLUMN observacao VARCHAR(500) NULL AFTER previsao_busca;

SET SQL_SAFE_UPDATES = 1;

SELECT id, cliente_id, status, previsao_busca, observacao FROM pedido;
