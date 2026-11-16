CREATE DATABASE IF NOT EXISTS PI2
DEFAULT CHARACTER SET utf8mb4;

USE PI2;

-- ====================== USUÁRIO ======================
CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil ENUM('cliente', 'administrador') NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================== TELEFONE (vários por usuário) ======================
/*
CREATE TABLE IF NOT EXISTS telefone (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    numero VARCHAR(20) NOT NULL,
    tipo ENUM('celular','comercial','residencial') DEFAULT 'celular',
    CONSTRAINT fk_telefone_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);
*/
-- ====================== ENDEREÇO (preparação para frete) ======================
/*
CREATE TABLE IF NOT EXISTS endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    rua VARCHAR(255),
    numero VARCHAR(20),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(50),
    cep VARCHAR(15),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);
*/
-- ====================== produto ======================
CREATE TABLE IF NOT EXISTS produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao VARCHAR(255),
    preco_unitario DECIMAL(10,2) NOT NULL,
    quantidade_estoque INT NOT NULL DEFAULT 0,
    ativo BOOLEAN DEFAULT true
);

-- ====================== COTAÇÃO ======================
CREATE TABLE IF NOT EXISTS cotacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    validade DATETIME,
    status ENUM('pendente','respondida','convertida','recusada','cancelada', 'expirada') NOT NULL DEFAULT 'pendente',
    -- validade DATE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cotacao_cliente
    FOREIGN KEY (cliente_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS cotacao_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cotacao_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2),
    subtotal DECIMAL(10, 2),
    CONSTRAINT fk_cotacao_item_cotacao
    FOREIGN KEY (cotacao_id) REFERENCES cotacao(id) ON DELETE CASCADE,
    CONSTRAINT fk_cotacao_item_produto
    FOREIGN KEY (produto_id) REFERENCES produto(id)
);

-- ====================== PEDIDO ======================
CREATE TABLE IF NOT EXISTS pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    cotacao_id INT UNIQUE DEFAULT NULL,
    -- endereco_id INT DEFAULT NULL,
    status ENUM('pendente','respondido','entregue','cancelado') NOT NULL DEFAULT 'pendente',
    previsao_busca DATETIME,
    -- observacoes_entrega VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pedido_cliente
    FOREIGN KEY (cliente_id) REFERENCES usuario(id),
    CONSTRAINT fk_pedido_cotacao
    FOREIGN KEY (cotacao_id) REFERENCES cotacao(id)
    -- CONSTRAINT fk_pedido_endereco
    -- FOREIGN KEY (endereco_id) REFERENCES endereco(id)
);

CREATE TABLE IF NOT EXISTS pedido_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_pedido_item_pedido
    FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE,
    CONSTRAINT fk_pedido_item_produto
    FOREIGN KEY (produto_id) REFERENCES produto(id)
);

-- ====================== VENDA ======================
CREATE TABLE IF NOT EXISTS venda (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL UNIQUE,
    valor_total DECIMAL(10,2) NOT NULL,
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_venda_pedido
    FOREIGN KEY (pedido_id) REFERENCES pedido(id)
);

-- ====================== NOTA FISCAL ======================
CREATE TABLE IF NOT EXISTS nota (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venda_id INT NOT NULL UNIQUE,
    numero VARCHAR(30) NOT NULL UNIQUE,
    natureza_operacao VARCHAR(100) DEFAULT 'Venda de mercadoria',
    valor_total DECIMAL(10,2) NOT NULL,
    data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_nota_venda
    FOREIGN KEY (venda_id) REFERENCES venda(id)
);

CREATE TABLE IF NOT EXISTS nota_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nota_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_nota_item_nota FOREIGN KEY (nota_id) REFERENCES nota(id) ON DELETE CASCADE,
    CONSTRAINT fk_nota_item_produto FOREIGN KEY (produto_id) REFERENCES produto(id)
);

-- ====================== MOVIMENTAÇÃO DE ESTOQUE ======================
CREATE TABLE IF NOT EXISTS movimentacao_estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    nota_id INT DEFAULT NULL,
    tipo ENUM('entrada','saida') NOT NULL,
    quantidade INT NOT NULL,
    data_mov TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_movimentacao_estoque_produto
    FOREIGN KEY (produto_id) REFERENCES produto(id),
    CONSTRAINT fk_movimentacao_estoque_nota
    FOREIGN KEY (nota_id) REFERENCES nota(id)
);