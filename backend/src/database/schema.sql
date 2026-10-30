CREATE DATABASE IF NOT EXISTS PI2
DEFAULT CHARACTER SET utf8mb4;

USE PI2;

-- ====================== USUÁRIO ======================
CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    documento VARCHAR(20) NOT NULL,          -- CPF/CNPJ
    tipo ENUM('cliente', 'administrador') NOT NULL DEFAULT 'cliente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================== TELEFONE (vários por usuário) ======================
CREATE TABLE IF NOT EXISTS telefone (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    numero VARCHAR(20) NOT NULL,
    tipo ENUM('celular','comercial','residencial') DEFAULT 'celular',
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- ====================== ENDEREÇO (preparação para frete) ======================
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

-- ====================== LOTE (produto) ======================
CREATE TABLE IF NOT EXISTS lote (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_lote VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco_unitario DECIMAL(10,2) NOT NULL,   -- preço do catálogo por lote
    quantidade_lotes INT NOT NULL DEFAULT 0, -- saldo atual em estoque
    ativo BOOLEAN DEFAULT TRUE
);

-- ====================== COTAÇÃO ======================
-- pendente   : cliente criou, aguardando proposta do admin
-- respondida : admin enviou preço proposto
-- convertida : cliente aceitou -> pedido gerado automaticamente
-- recusada   : recusa após proposta (cliente ou admin sem estoque)
-- cancelada  : cliente cancelou antes de resposta
CREATE TABLE IF NOT EXISTS cotacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    status ENUM('pendente','respondida','convertida','recusada','cancelada')
        NOT NULL DEFAULT 'pendente',
    validade DATE,
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS cotacao_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cotacao_id INT NOT NULL,
    lote_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_proposto DECIMAL(10,2),            -- preço sugerido na negociação
    FOREIGN KEY (cotacao_id) REFERENCES cotacao(id) ON DELETE CASCADE,
    FOREIGN KEY (lote_id) REFERENCES lote(id)
);

-- ====================== PEDIDO ======================
-- pendente   : cliente criou, ainda não confirmou
-- concluido  : cliente finalizou -> venda + nota + baixa de estoque
-- entregue   : admin marcou a entrega como realizada
-- cancelado  : cancelado antes da conclusão
CREATE TABLE IF NOT EXISTS pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    cotacao_id INT DEFAULT NULL,             -- NULL = pedido direto
    endereco_id INT DEFAULT NULL,            -- entrega (futuro frete)
    status ENUM('pendente','concluido','entregue','cancelado')
        NOT NULL DEFAULT 'pendente',
    previsao_entrega DATETIME NULL,          -- definida pelo admin
    observacoes_entrega TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES usuario(id),
    FOREIGN KEY (cotacao_id) REFERENCES cotacao(id),
    FOREIGN KEY (endereco_id) REFERENCES endereco(id)
);

CREATE TABLE IF NOT EXISTS pedido_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    lote_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,   -- catálogo ou negociado (congelado)
    FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE,
    FOREIGN KEY (lote_id) REFERENCES lote(id)
);

-- ====================== VENDA ======================
CREATE TABLE IF NOT EXISTS venda (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL UNIQUE,   -- 1 venda por pedido concluído
    valor_total DECIMAL(10,2) NOT NULL,
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedido(id)
);

-- ====================== NOTA FISCAL ======================
CREATE TABLE IF NOT EXISTS nota (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venda_id INT NOT NULL UNIQUE,            -- 1 nota por venda
    numero VARCHAR(30) NOT NULL UNIQUE,      -- sequencial simulado
    natureza_operacao VARCHAR(100) DEFAULT 'Venda de mercadoria',
    valor_total DECIMAL(10,2) NOT NULL,
    data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venda_id) REFERENCES venda(id)
);

-- ====================== MOVIMENTAÇÃO DE ESTOQUE ======================
CREATE TABLE IF NOT EXISTS movimentacao_estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lote_id INT NOT NULL,
    nota_id INT DEFAULT NULL,                -- saída vinculada à nota
    tipo ENUM('entrada','saida') NOT NULL,
    quantidade INT NOT NULL,
    data_mov TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lote_id) REFERENCES lote(id),
    FOREIGN KEY (nota_id) REFERENCES nota(id)
);