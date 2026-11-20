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
-- produto 3: 100 - 8 = 92 (confirmação do pedido 2)
-- produto 4: 50 - 5 - 3 = 42 (pedido 3 entregue e confirmação do pedido 2)
INSERT INTO produto (id, nome, descricao, preco_unitario, quantidade_estoque, ativo, imagem) VALUES
(1, 'Palete PBR', 'Palete padrão PBR de madeira', 45.00, 190, TRUE, 'protagonistasLogo.png'),
(2, 'Palete descartável', 'Palete de madeira descartável', 25.00, 350, TRUE, 'protagonistasLogo.png'),
(3, 'Palete reforçado', 'Palete de madeira reforçado', 75.00, 92, TRUE, 'protagonistasLogo.png'),
(4, 'Palete plástico', 'Palete plástico industrial', 120.00, 42, TRUE, 'protagonistasLogo.png');

-- PEDIDOS
-- Fluxo: pendente -> confirmado -> pronto_retirada -> entregue (ou cancelado).
-- O estoque baixa quando o administrador confirma (pedidos 2 e 3 já baixaram).
INSERT INTO pedido (id, cliente_id, status, previsao_busca, observacao) VALUES
(1, 1, 'pendente', NULL, 'Posso retirar no fim da tarde.'),
(2, 1, 'confirmado', '2026-11-21 10:00:00', NULL),
(3, 1, 'entregue', '2026-11-10 14:00:00', NULL);

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
(2, NULL, 'entrada', 50),
(3, NULL, 'saida', 8),
(4, NULL, 'saida', 3);

-- Pedido 1 (pendente): serve para testar a confirmação pelo administrador
-- (baixa do estoque) e o cancelamento pelo cliente.
-- Pedido 2 (confirmado): segue para 'pronto_retirada' e depois 'entregue';
-- ao ser entregue, a venda é registrada automaticamente.
