USE PI2;

-- =====================================================================
-- DADOS DE DEMONSTRAÇÃO
-- Execute este arquivo apenas uma vez, depois do schema.sql, em um banco vazio.
-- (No Windows, rode pelo MySQL Workbench para os acentos saírem certos.)
--
-- As datas são RELATIVAS ao dia em que o seed roda (ex.: NOW() - INTERVAL 10 DAY).
-- Assim o painel sempre tem "pedido para retirar hoje" e "vendas do mês",
-- não importa o dia da apresentação.
--
-- Os clientes e empresas abaixo são FICTÍCIOS (só para demonstração).
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

-- TELEFONE e ENDEREÇO: tabelas ainda não criadas no schema (fora do escopo desta entrega)

-- ====================== PRODUTOS ======================
-- Produtos reais e preços fornecidos pela S Ferraretto.
-- Os estoques iniciais são coerentes com as movimentações
-- registradas ao final deste arquivo.
-- A loja vende só estes 3 paletes de madeira.

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
    65,
    TRUE,
    'palete-euro-epal.jpg'
);

-- ====================== PEDIDOS ======================
-- Fluxo: pendente -> confirmado -> pronto_retirada -> entregue (ou cancelado).
-- O estoque baixa quando o administrador CONFIRMA (pedidos 1, 2, 4 a 12 já baixaram).
--   Entregues (geram venda): 1, 2, 4, 6, 7 e 8 (o 8 foi entregue hoje)
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
INSERT INTO pedido_item (pedido_id, produto_id, quantidade, preco_unitario, subtotal) VALUES
(1, 1, 40, 45.00, 1800.00),
(2, 2, 60, 25.00, 1500.00),
(2, 1, 10, 45.00, 450.00),
(3, 3, 2, 75.00, 150.00),
(4, 3, 15, 75.00, 1125.00),
(5, 2, 10, 25.00, 250.00),
(6, 1, 30, 45.00, 1350.00),
(6, 2, 4, 25.00, 100.00),
(7, 2, 20, 25.00, 500.00),
(8, 1, 5, 45.00, 225.00),
(9, 2, 40, 25.00, 1000.00),
(10, 3, 6, 75.00, 450.00),
(11, 1, 20, 45.00, 900.00),
(11, 3, 4, 75.00, 300.00),
(12, 2, 3, 25.00, 75.00),
(13, 1, 50, 45.00, 2250.00),
(14, 2, 8, 25.00, 200.00),
(15, 3, 5, 75.00, 375.00),
(15, 2, 10, 25.00, 250.00);

-- ====================== VENDAS ======================
-- Uma venda para cada pedido entregue. A do pedido 8 é de hoje (o cartão "Vendas do mês" nunca fica zerado).
INSERT INTO venda (id, pedido_id, valor_total, data_venda) VALUES
(1, 1, 1800.00, NOW() - INTERVAL 78 DAY),
(2, 2, 1950.00, NOW() - INTERVAL 63 DAY),
(3, 4, 1125.00, NOW() - INTERVAL 43 DAY),
(4, 6, 1450.00, TIMESTAMP(LAST_DAY(CURDATE() - INTERVAL 1 MONTH), '14:00:00')),
(5, 7, 500.00, NOW() - INTERVAL 10 DAY),
(6, 8, 225.00, NOW());

-- ====================== NOTAS FISCAIS ======================
-- Só o número e os dados da nota (o PDF fica no Emitte).
--   NF-000002 foi cancelada (valor errado) e reemitida como NF-000003.
--   Toda venda tem nota (não existe venda sem nota).
INSERT INTO nota (id, venda_id, numero, natureza_operacao, valor_total, status, data_emissao) VALUES
(1, 1, 'NF-000001', 'Venda de mercadoria', 1800.00, 'emitida', NOW() - INTERVAL 78 DAY),
(2, 2, 'NF-000002', 'Venda de mercadoria', 1950.00, 'cancelada', NOW() - INTERVAL 63 DAY),
(3, 2, 'NF-000003', 'Venda de mercadoria', 1950.00, 'emitida', NOW() - INTERVAL 62 DAY),
(4, 3, 'NF-000004', 'Venda de mercadoria', 1125.00, 'emitida', NOW() - INTERVAL 43 DAY),
(5, 5, 'NF-000005', 'Venda de mercadoria', 500.00, 'emitida', NOW() - INTERVAL 10 DAY),
(6, 4, 'NF-000006', 'Venda de mercadoria', 1450.00, 'emitida', TIMESTAMP(LAST_DAY(CURDATE() - INTERVAL 1 MONTH), '14:00:00')),
(7, 6, 'NF-000007', 'Venda de mercadoria', 225.00, 'emitida', NOW());

-- ITENS DAS NOTAS (iguais aos itens do pedido da venda)
INSERT INTO nota_item (nota_id, produto_id, quantidade, preco_unitario, subtotal) VALUES
(1, 1, 40, 45.00, 1800.00),
(2, 2, 60, 25.00, 1500.00),
(2, 1, 10, 45.00, 450.00),
(3, 2, 60, 25.00, 1500.00),
(3, 1, 10, 45.00, 450.00),
(4, 3, 15, 75.00, 1125.00),
(5, 2, 20, 25.00, 500.00),
(6, 1, 30, 45.00, 1350.00),
(6, 2, 4, 25.00, 100.00),
(7, 1, 5, 45.00, 225.00);

-- ====================== MOVIMENTAÇÕES DE ESTOQUE ======================
-- Responsável: administrador 2. Em ordem de data.
-- Com pedido_id = feitas pelo sistema ao confirmar/cancelar; sem pedido_id = registradas à mão.
INSERT INTO movimentacao_estoque (produto_id, pedido_id, usuario_id, tipo, quantidade, motivo, data_mov) VALUES
(1, NULL, 2, 'entrada', 150, 'Estoque inicial (inventário de abertura)', NOW() - INTERVAL 90 DAY),
(2, NULL, 2, 'entrada', 157, 'Estoque inicial (inventário de abertura)', NOW() - INTERVAL 90 DAY),
(3, NULL, 2, 'entrada', 60, 'Estoque inicial (inventário de abertura)', NOW() - INTERVAL 90 DAY),
(1, 1, 2, 'saida', 40, 'Confirmação do pedido nº 1', NOW() - INTERVAL 79 DAY),
(2, 2, 2, 'saida', 60, 'Confirmação do pedido nº 2', NOW() - INTERVAL 64 DAY),
(1, 2, 2, 'saida', 10, 'Confirmação do pedido nº 2', NOW() - INTERVAL 64 DAY),
(1, NULL, 2, 'entrada', 100, 'Chegada de lote do fornecedor', NOW() - INTERVAL 50 DAY),
(3, 4, 2, 'saida', 15, 'Confirmação do pedido nº 4', NOW() - INTERVAL 44 DAY),
(2, 5, 2, 'saida', 10, 'Confirmação do pedido nº 5', NOW() - INTERVAL 34 DAY),
(2, 5, 2, 'entrada', 10, 'Cancelamento do pedido nº 5 (estoque devolvido)', NOW() - INTERVAL 33 DAY),
(2, NULL, 2, 'entrada', 100, 'Chegada de lote do fornecedor', NOW() - INTERVAL 30 DAY),
(1, NULL, 2, 'saida', 3, 'Avaria no transporte (3 paletes quebrados)', NOW() - INTERVAL 28 DAY),
(1, 6, 2, 'saida', 30, 'Confirmação do pedido nº 6', TIMESTAMP(LAST_DAY(CURDATE() - INTERVAL 1 MONTH) - INTERVAL 1 DAY, '10:00:00')),
(2, 6, 2, 'saida', 4, 'Confirmação do pedido nº 6', TIMESTAMP(LAST_DAY(CURDATE() - INTERVAL 1 MONTH) - INTERVAL 1 DAY, '10:00:00')),
(3, NULL, 2, 'entrada', 30, 'Chegada de lote do fornecedor', NOW() - INTERVAL 15 DAY),
(2, 7, 2, 'saida', 20, 'Confirmação do pedido nº 7', NOW() - INTERVAL 11 DAY),
(2, NULL, 2, 'saida', 2, 'Ajuste de inventário (contagem menor que o sistema)', NOW() - INTERVAL 8 DAY),
(2, 9, 2, 'saida', 40, 'Confirmação do pedido nº 9', NOW() - INTERVAL 3 DAY),
(3, 10, 2, 'saida', 6, 'Confirmação do pedido nº 10', NOW() - INTERVAL 2 DAY),
(1, 11, 2, 'saida', 20, 'Confirmação do pedido nº 11', NOW() - INTERVAL 1 DAY),
(3, 11, 2, 'saida', 4, 'Confirmação do pedido nº 11', NOW() - INTERVAL 1 DAY),
(2, 12, 2, 'saida', 3, 'Confirmação do pedido nº 12', NOW() - INTERVAL 1 DAY),
(1, 8, 2, 'saida', 5, 'Confirmação do pedido nº 8', NOW() - INTERVAL 1 DAY);
