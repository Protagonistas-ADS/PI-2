-- =====================================================================
-- MIGRAÇÃO: tirar o logo da equipe das fotos dos produtos
-- =====================================================================
-- Para quem JÁ TEM o banco PI2 com o seed antigo.
-- (Quem for criar o banco do zero só precisa rodar schema.sql + seed.sql.)
--
-- O seed antigo usava o logo "Protagonistas ADS" (protagonistasLogo.png)
-- como foto de todos os produtos. Enquanto não há fotos reais dos paletes,
-- a coluna fica vazia (NULL) e o site mostra a foto padrão de paletes.
--
-- Não apaga nenhum produto: só limpa o texto da coluna imagem.
-- =====================================================================

USE PI2;

-- Desliga a trava do Workbench que impede UPDATE sem usar a chave primária
SET SQL_SAFE_UPDATES = 0;

UPDATE produto
SET imagem = NULL
WHERE imagem = 'protagonistasLogo.png';

SET SQL_SAFE_UPDATES = 1;
