USE PI2;

-- =====================================================================
-- DML — DADOS DE DEMONSTRAÇÃO (INSERT INTO nas 8 tabelas)
-- Execute este arquivo apenas uma vez, depois do schema.sql (DDL), em um banco vazio.
-- (No Windows, rode pelo MySQL Workbench para os acentos saírem certos.)
-- As consultas (DQL) ficam em consultas.sql.
--
-- Registros por tabela: usuario 8 · produto 5 · pedido 15 · pedido_item 19 ·
-- venda 6 · nota 5 · nota_item 7 · movimentacao_estoque 27 (todas com 5 ou mais).
--
-- As datas são RELATIVAS ao dia em que o seed roda (ex.: NOW() - INTERVAL 10 DAY).
-- Assim o painel sempre tem "pedido para retirar hoje" e "vendas do mês",
-- não importa o dia da apresentação.
--
-- Os clientes e empresas abaixo são FICTÍCIOS (só para demonstração).
-- Subtotais e totais NÃO são inseridos: são atributos derivados, calculados nas consultas.
--
-- CONTAS DE TESTE
--   Administrador: admin@teste.com    / Admin@123456
--   Clientes:      usuario@gmail.com  / Cliente@123456  (todos os clientes usam a mesma senha)
-- =====================================================================

-- ====================== USUÁRIOS ======================
INSERT INTO usuario (id, nome, email, senha, perfil, criado_em) VALUES
(1, 'Cliente Teste', 'usuario@gmail.com', '$2b$10$8afLr3ac9O0eW3x/PZtdlewp.wr3EY1fGuuzumeCyugbXYzvge3cS', 'cliente', NOW() - INTERVAL 88 DAY),
(2, 'Administrador Teste', 'admin@teste.com', '$2b$10$3nrY0hmaIH5oE5KR2J66muG7yv2yuDCoPbiV84B8IGHeh/asV1Cwy', 'administrador', NOW() - INTERVAL 95 DAY),
(3, 'Transportadora Rota Sul Ltda', 'compras@rotasul.com.br', '$2b$10$8afLr3ac9O0eW3x/PZtdlewp.wr3EY1fGuuzumeCyugbXYzvge3cS', 'cliente', NOW() - INTERVAL 85 DAY),
(4, 'Mercado Bom Preço', 'contato@mercadobompreco.com.br', '$2b$10$8afLr3ac9O0eW3x/PZtdlewp.wr3EY1fGuuzumeCyugbXYzvge3cS', 'cliente', NOW() - INTERVAL 70 DAY),
(5, 'Marcenaria Irmãos Duarte', 'irmaosduarte@hotmail.com', '$2b$10$8afLr3ac9O0eW3x/PZtdlewp.wr3EY1fGuuzumeCyugbXYzvge3cS', 'cliente', NOW() - INTERVAL 50 DAY),
(6, 'Ana Paula Ribeiro', 'anapaula.ribeiro@outlook.com', '$2b$10$8afLr3ac9O0eW3x/PZtdlewp.wr3EY1fGuuzumeCyugbXYzvge3cS', 'cliente', NOW() - INTERVAL 60 DAY),
(7, 'Logística Itu Express', 'financeiro@ituexpress.com.br', '$2b$10$8afLr3ac9O0eW3x/PZtdlewp.wr3EY1fGuuzumeCyugbXYzvge3cS', 'cliente', NOW() - INTERVAL 40 DAY),
(8, 'Rafael Moreira', 'rafael.moreira@yahoo.com.br', '$2b$10$8afLr3ac9O0eW3x/PZtdlewp.wr3EY1fGuuzumeCyugbXYzvge3cS', 'cliente', NOW() - INTERVAL 5 DAY);

-- TELEFONE e ENDEREÇO: estão comentadas no schema.sql (fora do escopo desta entrega)

-- ====================== PRODUTOS ======================
-- 1 a 3: produtos reais e preços fornecidos pela S Ferraretto (os que aparecem no catálogo).
-- 4 e 5: produtos que SAÍRAM DE LINHA (ativo = FALSE). Não aparecem no catálogo, mas
-- continuam no banco para guardar o histórico dos pedidos e movimentações antigas.
--
-- O estoque de cada produto é EXATAMENTE a soma das movimentações do final deste arquivo
-- (entradas - saídas). A conta, por produto:
--   1 PBR:      150 inicial + 100 lote - 3 avaria - (40+10+30+5+20) pedidos 1,2,6,8,11 = 142
--   2 Cavinha:  150 inicial + 100 lote - 2 ajuste - (60+20+40) pedidos 2,7,9          = 128
--   3 Euro:      60 inicial +  30 lote - (15+6+4+3) pedidos 4,10,11,12                 =  62
--   4 Plástico:  16 inicial - (10+4) pedidos 5,6 + 10 devolvidos (pedido 5 cancelado)
--                - 12 devolvidos ao fornecedor (saiu de linha)                          =   0
--   5 Descartável: 40 inicial - 40 devolvidos ao fornecedor (saiu de linha)             =   0
INSERT INTO produto
    (id, nome, descricao, preco_unitario, quantidade_estoque, ativo, imagem)
VALUES
(
    1,
    'Palete PBR',
    'Palete de madeira amplamente utilizado na logística brasileira, possui nove blocos de apoio e quatro entradas, facilitando o transporte e a armazenagem de mercadorias.',
    65.00,
    142,
    TRUE,
    'palete-pbr.jpg'
),
(
    2,
    'Palete Cavinha',
    'Palete de madeira compacto e versátil, ideal para armazenamento, organização e movimentação de mercadorias, especialmente em operações que necessitam de suportes menores.',
    42.00,
    128,
    TRUE,
    'palete-cavinha.jpg'
),
(
    3,
    'Palete Euro (EPAL)',
    'Palete de madeira padronizado e reforçado, oferece resistência e estabilidade para armazenamento e transporte de mercadorias, com fácil movimentação por empilhadeiras e paleteiras.',
    48.00,
    62,
    TRUE,
    'palete-euro-epal.jpg'
),
(
    4,
    'Palete plástico',
    'Palete plástico industrial. Saiu de linha: mantido no sistema para guardar o histórico dos pedidos.',
    120.00,
    0,
    FALSE,
    NULL
),
(
    5,
    'Palete descartável',
    'Palete leve de madeira para uso único. Saiu de linha antes de ser vendido pelo site.',
    30.00,
    0,
    FALSE,
    NULL
);

-- ====================== PEDIDOS ======================
-- Fluxo: pendente -> confirmado -> pronto_retirada -> entregue (ou cancelado).
-- O estoque baixa quando o administrador CONFIRMA (pedidos 1, 2, 4 a 12 já baixaram).
--   Entregues (geram venda): 1, 2, 4, 6, 7 e 8 (o 8 foi entregue hoje; o 6, no último dia do mês passado)
--   Cancelados: 3 (antes de confirmar, sem mexer no estoque) e 5 (depois de confirmar: estoque devolvido)
--   Prontos para retirada: 9 (retirada HOJE) e 10 (amanhã)
--   Confirmados: 11 e 12
--   Pendentes: 13, 14 e 15 (cabem no estoque: servem para demonstrar o "Confirmar")
INSERT INTO pedido (id, cliente_id, status, previsao_busca, observacao, criado_em) VALUES
(1, 3, 'entregue', TIMESTAMP(CURDATE() - INTERVAL 78 DAY, '10:00:00'), NULL, NOW() - INTERVAL 80 DAY),
(2, 4, 'entregue', TIMESTAMP(CURDATE() - INTERVAL 63 DAY, '09:00:00'), 'Vamos buscar com caminhão próprio.', NOW() - INTERVAL 65 DAY),
(3, 6, 'cancelado', NULL, NULL, NOW() - INTERVAL 55 DAY),
(4, 5, 'entregue', TIMESTAMP(CURDATE() - INTERVAL 43 DAY, '14:00:00'), NULL, NOW() - INTERVAL 45 DAY),
(5, 7, 'cancelado', TIMESTAMP(CURDATE() - INTERVAL 32 DAY, '08:00:00'), NULL, NOW() - INTERVAL 35 DAY),
(6, 3, 'entregue', TIMESTAMP(LAST_DAY(CURDATE() - INTERVAL 1 MONTH), '10:00:00'), NULL, TIMESTAMP(LAST_DAY(CURDATE() - INTERVAL 1 MONTH) - INTERVAL 2 DAY, '09:00:00')),
(7, 1, 'entregue', TIMESTAMP(CURDATE() - INTERVAL 10 DAY, '16:00:00'), NULL, NOW() - INTERVAL 12 DAY),
(8, 6, 'entregue', TIMESTAMP(CURDATE(), '09:00:00'), NULL, NOW() - INTERVAL 2 DAY),
(9, 4, 'pronto_retirada', TIMESTAMP(CURDATE(), '10:00:00'), NULL, NOW() - INTERVAL 3 DAY),
(10, 5, 'pronto_retirada', TIMESTAMP(CURDATE() + INTERVAL 1 DAY, '15:00:00'), 'Separar os mais novos, por favor.', NOW() - INTERVAL 2 DAY),
(11, 7, 'confirmado', TIMESTAMP(CURDATE() + INTERVAL 2 DAY, '09:00:00'), NULL, NOW() - INTERVAL 2 DAY),
(12, 1, 'confirmado', TIMESTAMP(CURDATE() + INTERVAL 3 DAY, '16:00:00'), NULL, NOW() - INTERVAL 1 DAY),
(13, 3, 'pendente', TIMESTAMP(CURDATE() + INTERVAL 4 DAY, '08:00:00'), 'Precisamos de nota fiscal no CNPJ da empresa.', NOW() - INTERVAL 1 DAY),
(14, 6, 'pendente', NULL, 'Posso retirar no fim da tarde.', NOW() - INTERVAL 3 HOUR),
(15, 1, 'pendente', NULL, NULL, NOW() - INTERVAL 1 HOUR);

-- ====================== ITENS DOS PEDIDOS ======================
-- preco_unitario = preço do produto no dia do pedido (fica guardado: o catálogo pode mudar).
-- O subtotal (quantidade x preço) não é inserido: é calculado nas consultas.
INSERT INTO pedido_item (pedido_id, produto_id, quantidade, preco_unitario) VALUES
(1, 1, 40, 65.00),
(2, 2, 60, 42.00),
(2, 1, 10, 65.00),
(3, 3, 2, 48.00),
(4, 3, 15, 48.00),
(5, 4, 10, 120.00),
(6, 1, 30, 65.00),
(6, 4, 4, 120.00),
(7, 2, 20, 42.00),
(8, 1, 5, 65.00),
(9, 2, 40, 42.00),
(10, 3, 6, 48.00),
(11, 1, 20, 65.00),
(11, 3, 4, 48.00),
(12, 3, 3, 48.00),
(13, 1, 50, 65.00),
(14, 2, 8, 42.00),
(15, 3, 5, 48.00),
(15, 2, 10, 42.00);

-- ====================== VENDAS ======================
-- Uma venda para cada pedido entregue. A do pedido 8 é de hoje (o cartão "Vendas do mês" nunca fica zerado).
-- O valor da venda não é inserido: é a soma dos itens do pedido (calculada nas consultas).
-- Valores calculados: venda 1 = R$ 2.600 · 2 = R$ 3.170 · 3 = R$ 720 · 4 = R$ 2.430 · 5 = R$ 840 · 6 = R$ 325
INSERT INTO venda (id, pedido_id, data_venda) VALUES
(1, 1, NOW() - INTERVAL 78 DAY),
(2, 2, NOW() - INTERVAL 63 DAY),
(3, 4, NOW() - INTERVAL 43 DAY),
(4, 6, TIMESTAMP(LAST_DAY(CURDATE() - INTERVAL 1 MONTH), '14:00:00')),
(5, 7, NOW() - INTERVAL 10 DAY),
(6, 8, NOW());

-- ====================== NOTAS FISCAIS ======================
-- Só os dados + link do PDF no Emitte. Os links usam example.com (endereço reservado para exemplos).
--   NF-000002 foi cancelada (Palete Cavinha com preço errado, R$ 40) e reemitida como NF-000003.
--   NF-000004 está sem link (serve para demonstrar "Adicionar link").
--   As vendas 4 e 6 estão sem nota (servem para demonstrar "Emitir nota").
-- O valor da nota não é inserido: é a soma dos itens da nota (calculada nas consultas).
INSERT INTO nota (id, venda_id, numero, natureza_operacao, status, link_pdf, data_emissao) VALUES
(1, 1, 'NF-000001', 'Venda de mercadoria', 'emitida', 'https://example.com/notas/NF-000001.pdf', NOW() - INTERVAL 78 DAY),
(2, 2, 'NF-000002', 'Venda de mercadoria', 'cancelada', 'https://example.com/notas/NF-000002.pdf', NOW() - INTERVAL 63 DAY),
(3, 2, 'NF-000003', 'Venda de mercadoria', 'emitida', 'https://example.com/notas/NF-000003.pdf', NOW() - INTERVAL 62 DAY),
(4, 3, 'NF-000004', 'Venda de mercadoria', 'emitida', NULL, NOW() - INTERVAL 43 DAY),
(5, 5, 'NF-000005', 'Venda de mercadoria', 'emitida', 'https://example.com/notas/NF-000005.pdf', NOW() - INTERVAL 10 DAY);

-- ITENS DAS NOTAS (iguais aos itens do pedido da venda, menos na NF-000002, que tinha o preço errado)
INSERT INTO nota_item (nota_id, produto_id, quantidade, preco_unitario) VALUES
(1, 1, 40, 65.00),
(2, 2, 60, 40.00),
(2, 1, 10, 65.00),
(3, 2, 60, 42.00),
(3, 1, 10, 65.00),
(4, 3, 15, 48.00),
(5, 2, 20, 42.00);

-- ====================== MOVIMENTAÇÕES DE ESTOQUE ======================
-- Responsável: administrador 2. Em ordem de data.
-- Com pedido_id = feitas pelo sistema ao confirmar/cancelar; sem pedido_id = registradas à mão.
INSERT INTO movimentacao_estoque (produto_id, pedido_id, usuario_id, tipo, quantidade, motivo, data_mov) VALUES
(1, NULL, 2, 'entrada', 150, 'Estoque inicial (inventário de abertura)', NOW() - INTERVAL 90 DAY),
(2, NULL, 2, 'entrada', 150, 'Estoque inicial (inventário de abertura)', NOW() - INTERVAL 90 DAY),
(3, NULL, 2, 'entrada', 60, 'Estoque inicial (inventário de abertura)', NOW() - INTERVAL 90 DAY),
(4, NULL, 2, 'entrada', 16, 'Estoque inicial (inventário de abertura)', NOW() - INTERVAL 90 DAY),
(5, NULL, 2, 'entrada', 40, 'Estoque inicial (inventário de abertura)', NOW() - INTERVAL 90 DAY),
(1, 1, 2, 'saida', 40, 'Confirmação do pedido nº 1', NOW() - INTERVAL 79 DAY),
(5, NULL, 2, 'saida', 40, 'Produto saiu de linha (lote devolvido ao fornecedor)', NOW() - INTERVAL 70 DAY),
(2, 2, 2, 'saida', 60, 'Confirmação do pedido nº 2', NOW() - INTERVAL 64 DAY),
(1, 2, 2, 'saida', 10, 'Confirmação do pedido nº 2', NOW() - INTERVAL 64 DAY),
(1, NULL, 2, 'entrada', 100, 'Chegada de lote do fornecedor', NOW() - INTERVAL 50 DAY),
(3, 4, 2, 'saida', 15, 'Confirmação do pedido nº 4', NOW() - INTERVAL 44 DAY),
(4, 5, 2, 'saida', 10, 'Confirmação do pedido nº 5', NOW() - INTERVAL 34 DAY),
(4, 5, 2, 'entrada', 10, 'Cancelamento do pedido nº 5 (estoque devolvido)', NOW() - INTERVAL 33 DAY),
(2, NULL, 2, 'entrada', 100, 'Chegada de lote do fornecedor', NOW() - INTERVAL 30 DAY),
(1, NULL, 2, 'saida', 3, 'Avaria no transporte (3 paletes quebrados)', NOW() - INTERVAL 28 DAY),
(1, 6, 2, 'saida', 30, 'Confirmação do pedido nº 6', TIMESTAMP(LAST_DAY(CURDATE() - INTERVAL 1 MONTH) - INTERVAL 1 DAY, '10:00:00')),
(4, 6, 2, 'saida', 4, 'Confirmação do pedido nº 6', TIMESTAMP(LAST_DAY(CURDATE() - INTERVAL 1 MONTH) - INTERVAL 1 DAY, '10:00:00')),
(3, NULL, 2, 'entrada', 30, 'Chegada de lote do fornecedor', NOW() - INTERVAL 15 DAY),
(2, 7, 2, 'saida', 20, 'Confirmação do pedido nº 7', NOW() - INTERVAL 11 DAY),
(2, NULL, 2, 'saida', 2, 'Ajuste de inventário (contagem menor que o sistema)', NOW() - INTERVAL 8 DAY),
(2, 9, 2, 'saida', 40, 'Confirmação do pedido nº 9', NOW() - INTERVAL 3 DAY),
(3, 10, 2, 'saida', 6, 'Confirmação do pedido nº 10', NOW() - INTERVAL 2 DAY),
(1, 11, 2, 'saida', 20, 'Confirmação do pedido nº 11', NOW() - INTERVAL 1 DAY),
(3, 11, 2, 'saida', 4, 'Confirmação do pedido nº 11', NOW() - INTERVAL 1 DAY),
(3, 12, 2, 'saida', 3, 'Confirmação do pedido nº 12', NOW() - INTERVAL 1 DAY),
(1, 8, 2, 'saida', 5, 'Confirmação do pedido nº 8', NOW() - INTERVAL 1 DAY),
(4, NULL, 2, 'saida', 12, 'Produto saiu de linha (saldo devolvido ao fornecedor)', NOW() - INTERVAL 1 DAY);
