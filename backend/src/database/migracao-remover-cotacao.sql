-- =====================================================================
-- MIGRAÇÃO: remover o módulo de cotação (o sistema passa a usar só pedidos)
-- =====================================================================
-- Para quem JÁ TEM o banco PI2 criado com a versão antiga do schema.sql.
-- (Quem for criar o banco do zero só precisa rodar schema.sql + seed.sql.)
--
-- O QUE ESTE SCRIPT APAGA:
--   - a tabela cotacao_item (itens das cotações)
--   - a tabela cotacao (as cotações)
--   - a coluna pedido.cotacao_id (o vínculo pedido -> cotação)
--
-- O QUE CONTINUA INTACTO: usuários, produtos, pedidos e seus itens,
-- vendas, notas fiscais e movimentações de estoque.
--
-- ATENÇÃO: os dados de cotação são apagados de vez. Se quiser guardar uma
-- cópia antes, exporte as tabelas cotacao e cotacao_item no MySQL Workbench
-- (Server > Data Export).
--
-- Obs.: comandos que mudam a estrutura (ALTER/DROP) não podem ser desfeitos
-- no MySQL, por isso a exportação acima é a sua rede de segurança.
--
-- Rode UMA vez, no MySQL Workbench, com o banco PI2 selecionado.
-- =====================================================================

USE PI2;

-- 1. Remove o vínculo (chave estrangeira) entre pedido e cotação
ALTER TABLE pedido DROP FOREIGN KEY fk_pedido_cotacao;

-- 2. Remove a coluna cotacao_id do pedido (o índice dela sai junto)
ALTER TABLE pedido DROP COLUMN cotacao_id;

-- 3. Remove as tabelas de cotação (itens primeiro, por causa da chave estrangeira)
DROP TABLE IF EXISTS cotacao_item;
DROP TABLE IF EXISTS cotacao;

-- Conferência: a lista abaixo NÃO deve mostrar cotacao nem cotacao_item
SHOW TABLES;
