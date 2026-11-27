USE PI2;

-- =====================================================================
-- DQL — CONSULTAS DO SISTEMA DE PALETES (S FERRARETTO)
-- Rode depois do schema.sql (DDL) e do seed.sql (DML).
-- Cada consulta responde a uma pergunta real da loja.
--
-- Recursos usados (o que o professor pediu):
--   JOIN ............................ consultas 1, 2, 3, 4, 6 e 7
--   WHERE ........................... consultas 2, 3, 4, 5 e 7
--   GROUP BY + HAVING ............... consultas 2 e 3
--   ORDER BY ........................ todas
--   Subconsulta ..................... consultas 5 e 6
--   Funções de agregação ............ SUM, COUNT, AVG, MIN e MAX (consultas 1 a 7)
--
-- Atributos derivados: subtotal e valor total NÃO ficam guardados no banco.
-- Eles são calculados aqui com SUM(quantidade * preco_unitario).
-- O preco_unitario do item fica guardado porque é o preço NO DIA da compra
-- (o preço do catálogo pode mudar depois) — ele não é derivado.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. FATURAMENTO MENSAL
-- Quanto a loja vendeu em cada mês e quantas vendas fez.
-- Recursos: JOIN, GROUP BY, ORDER BY, SUM, COUNT
-- ---------------------------------------------------------------------
SELECT
    DATE_FORMAT(v.data_venda, '%Y-%m')         AS mes,
    COUNT(DISTINCT v.id)                       AS quantidade_vendas,
    SUM(pi.quantidade)                         AS paletes_vendidos,
    SUM(pi.quantidade * pi.preco_unitario)     AS faturamento
FROM venda v
INNER JOIN pedido_item pi ON pi.pedido_id = v.pedido_id
GROUP BY DATE_FORMAT(v.data_venda, '%Y-%m')
ORDER BY mes;


-- ---------------------------------------------------------------------
-- 2. PRODUTOS MAIS VENDIDOS (com pelo menos 20 unidades vendidas)
-- Só conta pedidos que viraram venda (entregues).
-- Recursos: JOIN, WHERE, GROUP BY, HAVING, ORDER BY, SUM
-- ---------------------------------------------------------------------
SELECT
    pr.nome                                    AS produto,
    SUM(pi.quantidade)                         AS unidades_vendidas,
    SUM(pi.quantidade * pi.preco_unitario)     AS valor_vendido
FROM pedido_item pi
INNER JOIN pedido  p  ON p.id  = pi.pedido_id
INNER JOIN venda   v  ON v.pedido_id = p.id
INNER JOIN produto pr ON pr.id = pi.produto_id
WHERE p.status = 'entregue'
GROUP BY pr.id, pr.nome
HAVING SUM(pi.quantidade) >= 20
ORDER BY unidades_vendidas DESC;


-- ---------------------------------------------------------------------
-- 3. MELHORES CLIENTES (compraram mais de R$ 1.000,00)
-- Quem são os clientes que mais trazem dinheiro para a loja.
-- Recursos: JOIN, WHERE, GROUP BY, HAVING, ORDER BY, SUM, COUNT
-- ---------------------------------------------------------------------
SELECT
    u.nome                                     AS cliente,
    u.email,
    COUNT(DISTINCT v.id)                       AS compras,
    SUM(pi.quantidade * pi.preco_unitario)     AS total_comprado
FROM usuario u
INNER JOIN pedido      p  ON p.cliente_id = u.id
INNER JOIN venda       v  ON v.pedido_id  = p.id
INNER JOIN pedido_item pi ON pi.pedido_id = p.id
WHERE u.perfil = 'cliente'
GROUP BY u.id, u.nome, u.email
HAVING SUM(pi.quantidade * pi.preco_unitario) > 1000
ORDER BY total_comprado DESC;


-- ---------------------------------------------------------------------
-- 4. PEDIDOS EM ANDAMENTO (o que a loja ainda precisa separar ou entregar)
-- Com o cliente, a data de retirada e o valor de cada pedido.
-- Recursos: JOIN, WHERE, GROUP BY, ORDER BY, SUM
-- ---------------------------------------------------------------------
SELECT
    p.id                                       AS pedido,
    u.nome                                     AS cliente,
    p.status,
    p.previsao_busca                           AS retirada_prevista,
    SUM(pi.quantidade)                         AS paletes,
    SUM(pi.quantidade * pi.preco_unitario)     AS valor_total
FROM pedido p
INNER JOIN usuario     u  ON u.id = p.cliente_id
INNER JOIN pedido_item pi ON pi.pedido_id = p.id
WHERE p.status IN ('pendente', 'confirmado', 'pronto_retirada')
GROUP BY p.id, u.nome, p.status, p.previsao_busca
ORDER BY p.previsao_busca IS NULL, p.previsao_busca, p.id;


-- ---------------------------------------------------------------------
-- 5. PRODUTOS ATIVOS COM ESTOQUE ABAIXO DA MÉDIA
-- Ajuda a decidir o que comprar primeiro do fornecedor.
-- A média é calculada por uma SUBCONSULTA.
-- Recursos: WHERE, subconsulta, AVG, ORDER BY
-- ---------------------------------------------------------------------
SELECT
    nome                                       AS produto,
    quantidade_estoque,
    (SELECT ROUND(AVG(quantidade_estoque), 1)
       FROM produto
      WHERE ativo = TRUE)                      AS media_estoque
FROM produto
WHERE ativo = TRUE
  AND quantidade_estoque < (SELECT AVG(quantidade_estoque)
                              FROM produto
                             WHERE ativo = TRUE)
ORDER BY quantidade_estoque;


-- ---------------------------------------------------------------------
-- 6. CONFERÊNCIA DO ESTOQUE (auditoria)
-- O estoque de cada produto deve ser igual a entradas - saídas do histórico.
-- A coluna "confere" mostra SIM quando bate.
-- Recursos: LEFT JOIN, subconsulta (tabela derivada), SUM, ORDER BY
-- ---------------------------------------------------------------------
SELECT
    pr.id,
    pr.nome                                    AS produto,
    pr.quantidade_estoque                      AS estoque_atual,
    COALESCE(m.saldo, 0)                       AS saldo_movimentacoes,
    IF(pr.quantidade_estoque = COALESCE(m.saldo, 0), 'SIM', 'NÃO') AS confere
FROM produto pr
LEFT JOIN (
    SELECT
        produto_id,
        SUM(CASE WHEN tipo = 'entrada' THEN quantidade ELSE -quantidade END) AS saldo
    FROM movimentacao_estoque
    GROUP BY produto_id
) AS m ON m.produto_id = pr.id
ORDER BY pr.id;


-- ---------------------------------------------------------------------
-- 7. NOTAS FISCAIS EMITIDAS COM O VALOR CALCULADO
-- Número da nota, venda, cliente e valor (soma dos itens da nota).
-- Recursos: JOIN, WHERE, GROUP BY, ORDER BY, SUM, COUNT, MIN, MAX
-- ---------------------------------------------------------------------
SELECT
    n.numero                                   AS nota,
    n.venda_id                                 AS venda,
    u.nome                                     AS cliente,
    DATE(n.data_emissao)                       AS emissao,
    COUNT(ni.id)                               AS itens,
    MIN(ni.preco_unitario)                     AS menor_preco,
    MAX(ni.preco_unitario)                     AS maior_preco,
    SUM(ni.quantidade * ni.preco_unitario)     AS valor_total
FROM nota n
INNER JOIN nota_item ni ON ni.nota_id = n.id
INNER JOIN venda     v  ON v.id = n.venda_id
INNER JOIN pedido    p  ON p.id = v.pedido_id
INNER JOIN usuario   u  ON u.id = p.cliente_id
WHERE n.status = 'emitida'
GROUP BY n.id, n.numero, n.venda_id, u.nome, n.data_emissao
ORDER BY n.data_emissao DESC;
