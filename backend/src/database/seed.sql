USE PI2;

-- DADOS DE TESTE
-- Execute este arquivo apenas uma vez, após executar schema.sql em um banco vazio.

-- USUÁRIOS
INSERT INTO usuario (id, nome, email, senha, perfil) VALUES
(1, 'Cliente Teste', 'usuario@gmail.com', '$2b$10$/0KD3SCoFNEG2gSXn5NWuevW9rrZt0wufmnp86IfB1QJ/EoVxcf8u', 'cliente'),
(2, 'Administrador Teste', 'admin@teste.com', '$2b$10$3nrY0hmaIH5oE5KR2J66muG7yv2yuDCoPbiV84B8IGHeh/asV1Cwy', 'administrador');

-- TELEFONE (tabela ainda não criada no schema)
-- INSERT INTO telefone (usuario_id, numero, tipo) VALUES
-- (1, '19999999999', 'celular'),
-- (1, '1933334444', 'comercial');

-- ENDEREÇO (tabela ainda não criada no schema)
-- INSERT INTO endereco (usuario_id, rua, numero, bairro, cidade, estado, cep) VALUES
-- (1, 'Rua das Flores', '100', 'Centro', 'Indaiatuba', 'SP', '13330000');

-- PRODUTOS
-- Os saldos consideram as movimentações históricas inseridas ao final:
-- produto 1: 200 - 10 = 190
-- produto 2: 300 + 50 = 350
-- produto 3: 100 (sem movimentação)
-- produto 4: 50 - 5 = 45
INSERT INTO produto (id, nome, descricao, preco_unitario, quantidade_estoque, ativo, imagem) VALUES
(1, 'Palete PBR', 'Palete padrão PBR de madeira', 45.00, 190, TRUE, '/uploads/protagonistasLogo.jpg'),
(2, 'Palete descartável', 'Palete de madeira descartável', 25.00, 350, TRUE, '/uploads/protagonistasLogo.jpg'),
(3, 'Palete reforçado', 'Palete de madeira reforçado', 75.00, 100, TRUE, '/uploads/protagonistasLogo.jpg'),
(4, 'Palete plástico', 'Palete plástico industrial', 120.00, 45, TRUE, '/uploads/protagonistasLogo.jpg');

-- COTAÇÕES
INSERT INTO cotacao (id, cliente_id, validade, status) VALUES
(1, 1, NULL, 'pendente'),
(2, 1, '2026-11-23 23:59:59', 'respondida'),
(3, 1, '2026-11-13 23:59:59', 'expirada'),
(4, 1, NULL, 'convertida');

-- ITENS DAS COTAÇÕES
INSERT INTO cotacao_item (cotacao_id, produto_id, quantidade, preco_unitario, subtotal) VALUES
(1, 1, 20, NULL, NULL),
(1, 2, 10, NULL, NULL),
(2, 3, 15, 70.00, 1050.00),
(2, 2, 30, 23.00, 690.00),
(3, 1, 50, 43.00, 2150.00),
(3, 3, 20, 72.00, 1440.00),
(4, 1, 10, 45.00, 450.00),
(4, 4, 5, 120.00, 600.00);

-- PEDIDOS
INSERT INTO pedido (id, cliente_id, cotacao_id, status, previsao_busca) VALUES
(1, 1, NULL, 'pendente', NULL),
(2, 1, NULL, 'respondido', '2026-11-21 10:00:00'),
(3, 1, 4, 'entregue', '2026-11-10 14:00:00');

-- ITENS DOS PEDIDOS
INSERT INTO pedido_item (pedido_id, produto_id, quantidade, preco_unitario, subtotal) VALUES
(1, 1, 10, 45.00, 450.00),
(1, 2, 5, 25.00, 125.00),
(2, 3, 8, 75.00, 600.00),
(2, 4, 3, 120.00, 360.00),
(3, 1, 10, 45.00, 450.00),
(3, 4, 5, 120.00, 600.00);

-- VENDA DE EXEMPLO (pedido 3)
INSERT INTO venda (id, pedido_id, valor_total) VALUES
(1, 3, 1050.00);

-- NOTA FISCAL DE EXEMPLO (venda 1)
INSERT INTO nota (id, venda_id, numero, natureza_operacao, valor_total) VALUES
(1, 1, 'NOTA-000001', 'Venda de mercadoria', 1050.00);

-- ITENS DA NOTA
INSERT INTO nota_item (nota_id, produto_id, quantidade, preco_unitario, subtotal) VALUES
(1, 1, 10, 45.00, 450.00),
(1, 4, 5, 120.00, 600.00);

-- MOVIMENTAÇÕES DE ESTOQUE
INSERT INTO movimentacao_estoque (produto_id, nota_id, tipo, quantidade) VALUES
(1, 1, 'saida', 10),
(4, 1, 'saida', 5),
(2, NULL, 'entrada', 50);

-- O pedido 2 permanece como 'respondido' e sem venda para permitir testar
-- a criação de uma venda pelo administrador.
