-- =====================================================================
-- MIGRAÇÃO: corrigir o caminho das imagens dos produtos
-- =====================================================================
-- Para quem JÁ TEM o banco PI2 com o seed antigo.
-- (Quem for criar o banco do zero só precisa rodar schema.sql + seed.sql.)
--
-- O seed antigo gravava '/uploads/protagonistasLogo.jpg', mas:
--   - o arquivo real é .png;
--   - o frontend já acrescenta '/uploads/' sozinho (o endereço ficava duplicado).
-- Agora a coluna produto.imagem guarda SÓ o nome do arquivo de backend/uploads.
--
-- Não apaga nada: só corrige o texto da coluna imagem.
-- =====================================================================

USE PI2;

-- Desliga a trava do Workbench que impede UPDATE sem usar a chave primária
SET SQL_SAFE_UPDATES = 0;

UPDATE produto
SET imagem = 'protagonistasLogo.png'
WHERE imagem = '/uploads/protagonistasLogo.jpg';

-- Para outros produtos: tira um '/uploads/' que tenha sobrado no começo
UPDATE produto
SET imagem = SUBSTRING(imagem, LENGTH('/uploads/') + 1)
WHERE imagem LIKE '/uploads/%';

SET SQL_SAFE_UPDATES = 1;

SELECT id, nome, imagem, ativo FROM produto;
