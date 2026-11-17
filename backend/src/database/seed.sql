USE PI2;

-- USUARIO
-- Substitua a senha pela hash bcrypt real.

INSERT INTO usuario (id, nome, email, senha, perfil) VALUES
(1, 'Cliente Teste', 'usuario@gmail.com', '$2b$10$/0KD3SCoFNEG2gSXn5NWuevW9rrZt0wufmnp86IfB1QJ/EoVxcf8u', 'cliente');

-- TELEFONE

--INSERT INTO telefone (usuario_id, numero, tipo) VALUES
--(1, '19999999999', 'celular'),
--(1, '1933334444', 'comercial');

-- ENDERECO

--INSERT INTO endereco (usuario_id, rua, numero, bairro, cidade, estado, cep) VALUES
--(1, 'Rua das Flores', '100', 'Centro', 'Indaiatuba', 'SP', '13330000');

-- PRODUTOS

INSERT INTO produto (id, nome, descricao, preco_unitario, quantidade_estoque, ativo) VALUES
(1, 'Palete PBR', 'Palete padrão PBR de madeira', 45.00, 200, TRUE),
(2, 'Palete descartável', 'Palete de madeira descartável', 25.00, 300, TRUE),
(3, 'Palete reforçado', 'Palete de madeira reforçado', 75.00, 100, TRUE),
(4, 'Palete plástico', 'Palete plástico industrial', 120.00, 50, TRUE);

-- COTACOES

INSERT INTO cotacao (id, cliente_id, validade, status) VALUES
(1, 1, NULL, 'pendente'),
(2, 1, '2026-11-23 23:59:59', 'respondida'),
(3, 1, '2026-11-13 23:59:59', 'expirada'),
(4, 1, NULL, 'convertida');

-- ITENS DAS COTACOES

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

-- VENDA

INSERT INTO venda (id, pedido_id, valor_total) VALUES
(1, 3, 1050.00);

-- NOTA

INSERT INTO nota (id, venda_id, numero, natureza_operacao, valor_total) VALUES
(1, 1, 'NOTA-000001', 'Venda de mercadoria', 1050.00);

-- ITENS DA NOTA

INSERT INTO nota_item (nota_id, produto_id, quantidade, preco_unitario, subtotal) VALUES
(1, 1, 10, 45.00, 450.00),
(1, 4, 5, 120.00, 600.00);

-- MOVIMENTACAO DE ESTOQUE

INSERT INTO movimentacao_estoque (produto_id, nota_id, tipo, quantidade) VALUES
(1, 1, 'saida', 10),
(4, 1, 'saida', 5),
(2, NULL, 'entrada', 50);