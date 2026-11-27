-- =====================================================================
-- MIGRAÇÃO: remover os atributos derivados
-- =====================================================================
-- Para quem JÁ TEM o banco PI2 criado com o schema antigo.
-- (Quem for criar o banco do zero só precisa rodar schema.sql + seed.sql.)
--
-- Atributo derivado = valor que dá para calcular a partir de outros dados
-- do banco. Guardar a conta pronta pode deixar o banco incoerente
-- (ex.: alguém muda a quantidade e esquece de mudar o subtotal).
--
-- O que sai:
--   - pedido_item.subtotal  -> quantidade x preco_unitario
--   - nota_item.subtotal    -> quantidade x preco_unitario
--   - venda.valor_total     -> soma dos itens do pedido da venda
--   - nota.valor_total      -> soma dos itens da nota
--
-- O preco_unitario de cada item CONTINUA guardado: ele é o preço do dia
-- da compra (o preço do catálogo pode mudar depois), então os valores
-- antigos não mudam. Nenhum pedido, venda ou nota é apagado.
--
-- Rode UMA vez (a mesma coluna não pode ser apagada duas vezes).
-- =====================================================================

USE PI2;

-- Conferência ANTES (opcional): se algum valor guardado não bater com a conta,
-- esta consulta mostra qual. O esperado é não voltar nenhuma linha.
SELECT v.id AS venda_id, v.valor_total AS guardado,
       SUM(pi.quantidade * pi.preco_unitario) AS calculado
FROM venda v
INNER JOIN pedido_item pi ON pi.pedido_id = v.pedido_id
GROUP BY v.id, v.valor_total
HAVING guardado <> calculado;

ALTER TABLE pedido_item DROP COLUMN subtotal;
ALTER TABLE nota_item   DROP COLUMN subtotal;
ALTER TABLE venda       DROP COLUMN valor_total;
ALTER TABLE nota        DROP COLUMN valor_total;
