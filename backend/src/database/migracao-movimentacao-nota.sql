-- =====================================================================
-- MIGRAÇÃO: movimentação com responsável/motivo/pedido (L7)
--           e nota fiscal com status e link do Emitte (L8)
-- =====================================================================
-- Para quem JÁ TEM o banco PI2 criado com o schema antigo.
-- (Quem for criar o banco do zero só precisa rodar schema.sql + seed.sql.)
--
-- O que muda:
--   movimentacao_estoque
--     - novas colunas: pedido_id (pedido que causou), usuario_id (quem fez), motivo
--     - a coluna nota_id sai: as movimentações ligadas a uma nota passam a
--       apontar para o pedido daquela nota (nota -> venda -> pedido)
--   nota
--     - novas colunas: status ('emitida' ou 'cancelada') e link_pdf
--     - venda_id deixa de ser UNIQUE: se a nota for cancelada, dá para
--       registrar outra para a mesma venda (o backend garante só uma 'emitida')
--
-- Não apaga nenhum registro. Rode UMA vez (as colunas não podem ser criadas duas vezes).
-- Rode pelo MySQL Workbench (pelo terminal do Windows os acentos podem sair errados).
-- =====================================================================

USE PI2;

SET SQL_SAFE_UPDATES = 0;

-- ---------------------- NOTA ----------------------

-- 1. Status e link do PDF (as notas que já existem ficam como 'emitida')
ALTER TABLE nota
    ADD COLUMN status ENUM('emitida','cancelada') NOT NULL DEFAULT 'emitida' AFTER valor_total,
    ADD COLUMN link_pdf VARCHAR(500) DEFAULT NULL AFTER status;

-- 2. Troca o índice único de venda_id por um índice comum
--    (o índice novo é criado antes, porque a chave estrangeira precisa de um)
ALTER TABLE nota ADD INDEX idx_nota_venda (venda_id);
ALTER TABLE nota DROP INDEX venda_id;

-- ---------------------- MOVIMENTAÇÃO ----------------------

-- 3. Novas colunas
ALTER TABLE movimentacao_estoque
    ADD COLUMN pedido_id INT DEFAULT NULL AFTER produto_id,
    ADD COLUMN usuario_id INT DEFAULT NULL AFTER pedido_id,
    ADD COLUMN motivo VARCHAR(255) DEFAULT NULL AFTER quantidade;

-- 4. Quem estava ligado a uma nota passa a apontar para o pedido da nota
UPDATE movimentacao_estoque m
INNER JOIN nota n ON n.id = m.nota_id
INNER JOIN venda v ON v.id = n.venda_id
SET m.pedido_id = v.pedido_id,
    m.motivo = COALESCE(m.motivo, CONCAT('Saída do pedido nº ', v.pedido_id));

-- 5. Remove a ligação antiga com a nota
ALTER TABLE movimentacao_estoque DROP FOREIGN KEY fk_movimentacao_estoque_nota;
ALTER TABLE movimentacao_estoque DROP COLUMN nota_id;

-- 6. Chaves estrangeiras novas
ALTER TABLE movimentacao_estoque
    ADD CONSTRAINT fk_movimentacao_estoque_pedido FOREIGN KEY (pedido_id) REFERENCES pedido(id),
    ADD CONSTRAINT fk_movimentacao_estoque_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id);

SET SQL_SAFE_UPDATES = 1;

-- Conferência rápida
SELECT id, produto_id, pedido_id, usuario_id, tipo, quantidade, motivo, data_mov FROM movimentacao_estoque;
SELECT id, venda_id, numero, status, link_pdf FROM nota;
