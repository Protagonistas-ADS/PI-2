-- =====================================================================
-- MIGRAÇÃO: remover o link do PDF da nota fiscal
-- =====================================================================
-- Para quem JÁ TEM o banco PI2 criado com a coluna nota.link_pdf.
-- (Quem for criar o banco do zero só precisa rodar schema.sql + seed.sql.)
--
-- O sistema passa a guardar só o número e os dados da nota fiscal;
-- o PDF fica no Emitte. Nenhuma nota é apagada.
-- Rode UMA vez (a mesma coluna não pode ser apagada duas vezes).
-- =====================================================================

USE PI2;

ALTER TABLE nota DROP COLUMN link_pdf;
