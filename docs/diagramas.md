# 📐 Diagramas do PI-2 (S Ferraretto)

Diagramas da versão final do sistema, **sem cotação**. Foram escritos em [Mermaid](https://mermaid.js.org/), um formato de texto que o GitHub desenha sozinho. Assim eles ficam no mesmo repositório que o código e são atualizados no mesmo Pull Request.

> Fonte da verdade: o banco vem de [`backend/src/database/schema.sql`](../backend/src/database/schema.sql), as regras vêm de [`backend/src/services/`](../backend/src/services) e as rotas de [`backend/src/routes/`](../backend/src/routes). Se algo mudar lá, atualize aqui também.

- [1. Modelo do banco (MER / modelo lógico)](#1-modelo-do-banco-mer--modelo-lógico)
- [2. Diagrama de casos de uso](#2-diagrama-de-casos-de-uso)
- [3. Diagrama de classes](#3-diagrama-de-classes)
- [4. Ciclo de vida do pedido](#4-ciclo-de-vida-do-pedido)

---

## 1. Modelo do banco (MER / modelo lógico)

Banco `PI2` (MySQL) com **8 tabelas**. `PK` = chave primária, `FK` = chave estrangeira, `UK` = valor único.

```mermaid
erDiagram
    USUARIO ||--o{ PEDIDO : "faz"
    USUARIO ||--o{ MOVIMENTACAO_ESTOQUE : "registra (responsável)"
    PEDIDO ||--|{ PEDIDO_ITEM : "contém"
    PRODUTO ||--o{ PEDIDO_ITEM : "aparece em"
    PEDIDO ||--o| VENDA : "gera (ao ser entregue)"
    PEDIDO ||--o{ MOVIMENTACAO_ESTOQUE : "origina"
    VENDA ||--o{ NOTA : "tem (só 1 emitida)"
    NOTA ||--|{ NOTA_ITEM : "contém"
    PRODUTO ||--o{ NOTA_ITEM : "aparece em"
    PRODUTO ||--o{ MOVIMENTACAO_ESTOQUE : "movimenta"

    USUARIO {
        int id PK
        varchar nome
        varchar email UK
        varchar senha "hash bcrypt"
        enum perfil "cliente | administrador"
        datetime criado_em
    }
    PRODUTO {
        int id PK
        varchar nome
        varchar descricao
        decimal preco_unitario
        int quantidade_estoque
        varchar imagem "nome do arquivo em uploads"
        boolean ativo "desativar em vez de apagar"
    }
    PEDIDO {
        int id PK
        int cliente_id FK
        enum status "pendente | confirmado | pronto_retirada | entregue | cancelado"
        datetime previsao_busca "opcional"
        varchar observacao "opcional, até 500"
        datetime criado_em
    }
    PEDIDO_ITEM {
        int id PK
        int pedido_id FK
        int produto_id FK
        int quantidade
        decimal preco_unitario "preço no dia do pedido"
        decimal subtotal
    }
    VENDA {
        int id PK
        int pedido_id FK,UK
        decimal valor_total
        datetime data_venda
    }
    NOTA {
        int id PK
        int venda_id FK
        varchar numero UK
        varchar natureza_operacao
        decimal valor_total
        enum status "emitida | cancelada"
        varchar link_pdf "PDF no Emitte (http/https)"
        datetime data_emissao
    }
    NOTA_ITEM {
        int id PK
        int nota_id FK
        int produto_id FK
        int quantidade
        decimal preco_unitario
        decimal subtotal
    }
    MOVIMENTACAO_ESTOQUE {
        int id PK
        int produto_id FK
        int pedido_id FK "vazio = manual"
        int usuario_id FK "admin responsável"
        enum tipo "entrada | saida"
        int quantidade
        varchar motivo
        datetime data_mov
    }
```

**Regras importantes:**

- `movimentacao_estoque` **não tem mais `nota_id`**. A origem é o `pedido_id` (vazio = movimentação manual), o responsável é o `usuario_id` e o `motivo` é obrigatório nas manuais.
- `nota` tem `status` (emitida/cancelada) e `link_pdf`. Uma venda pode ter várias notas no histórico, mas **só uma emitida**. Essa regra é conferida no backend.
- `venda.pedido_id` é único: um pedido gera no máximo uma venda.
- Produtos não são apagados (`ativo = false`), para não quebrar pedidos, vendas e notas antigos.
- `telefone` e `endereco` **não existem no banco**: estão só planejadas (comentadas no `schema.sql`) para a melhoria futura de telefone no cadastro e frete (L18).

<details>
<summary><b>📝 Lista para refazer o MER no BrModelo</b></summary>

<br>

**Entidades e atributos** (sublinhado = identificador):

| Entidade | Atributos |
|---|---|
| Usuario | <u>id</u>, nome, email (único), senha, perfil, criado_em |
| Produto | <u>id</u>, nome, descricao, preco_unitario, quantidade_estoque, imagem, ativo |
| Pedido | <u>id</u>, status, previsao_busca, observacao, criado_em |
| Venda | <u>id</u>, valor_total, data_venda |
| Nota | <u>id</u>, numero (único), natureza_operacao, valor_total, status, link_pdf, data_emissao |
| Movimentacao_Estoque | <u>id</u>, tipo, quantidade, motivo, data_mov |

**Relacionamentos** (cardinalidade):

| Relacionamento | Entre | Cardinalidade | Atributos do relacionamento |
|---|---|---|---|
| faz | Usuario — Pedido | 1 : N | — |
| contém (pedido_item) | Pedido — Produto | N : N | quantidade, preco_unitario, subtotal |
| gera | Pedido — Venda | 1 : 0..1 | — |
| tem | Venda — Nota | 1 : N | — |
| contém (nota_item) | Nota — Produto | N : N | quantidade, preco_unitario, subtotal |
| movimenta | Produto — Movimentacao_Estoque | 1 : N | — |
| origina | Pedido — Movimentacao_Estoque | 0..1 : N | — |
| registra | Usuario — Movimentacao_Estoque | 0..1 : N | — |

**Não incluir:** cotação, item de cotação, status "respondido", a ligação entre nota e movimentação e as tabelas planejadas `telefone` e `endereco` (ainda não existem no banco).

</details>

---

## 2. Diagrama de casos de uso

O Mermaid não tem o "bonequinho" da UML. Por isso os atores e os casos de uso aparecem como caixas: os atores à esquerda e o sistema no meio. `«include»` quer dizer "sempre acontece junto".

```mermaid
flowchart LR
    V(["🧑 Visitante"])
    C(["👤 Cliente"])
    A(["🛠️ Administrador"])
    C -. "é um visitante que entrou" .-> V

    subgraph SIS["Sistema S Ferraretto"]
        direction TB
        UC1(["Ver tela inicial e contatos"])
        UC2(["Ver catálogo e detalhes do produto"])
        UC3(["Montar carrinho"])
        UC4(["Criar conta"])
        UC5(["Fazer login"])
        UC6(["Enviar pedido"])
        UC7(["Acompanhar meus pedidos"])
        UC8(["Cancelar pedido pendente"])
        UC9(["Editar perfil (nome e senha)"])
        UA1(["Ver dashboard"])
        UA2(["Gerenciar status dos pedidos"])
        UA3(["Ver usuários"])
        UA4(["Registrar entrada/saída de estoque"])
        UA5(["Ver histórico de movimentações"])
        UA6(["Ver vendas"])
        UA7(["Registrar nota fiscal"])
        UA8(["Editar link / cancelar nota"])
        UA9(["Gerenciar produtos (API)"])
        UX1(["Baixar ou devolver estoque"])
        UX2(["Gerar venda"])
    end

    V --- UC1 & UC2 & UC3 & UC4 & UC5
    C --- UC6 & UC7 & UC8 & UC9
    A --- UC5
    A --- UA1 & UA2 & UA3 & UA4 & UA5 & UA6 & UA7 & UA8 & UA9 & UC9

    UC6 -. "«include» login" .-> UC5
    UA2 -. "«include» ao confirmar/cancelar" .-> UX1
    UA2 -. "«include» ao entregar" .-> UX2
    UA4 -. "«include»" .-> UX1
    UA7 -. "a partir de" .-> UA6

    style V fill:#f3f4f6,stroke:#6b7280,color:#111
    style C fill:#dbeafe,stroke:#2563eb,color:#111
    style A fill:#fef3c7,stroke:#d97706,color:#111
```

| Ator | Quem é | O que pode fazer |
|---|---|---|
| Visitante | Qualquer pessoa, sem login | Tela inicial, catálogo, carrinho, criar conta, entrar |
| Cliente | Usuário com perfil `cliente` | Tudo do visitante + enviar pedido, acompanhar, cancelar pendente, editar perfil |
| Administrador | Usuário com perfil `administrador` (criado no banco) | Painel `/admin`: dashboard, pedidos, usuários, estoque, vendas, notas, perfil e produtos (pela API) |

---

## 3. Diagrama de classes

Classes do domínio, com os atributos vindos do banco e as operações vindas dos *services* do backend (onde ficam as regras de negócio).

```mermaid
classDiagram
    direction LR

    class Usuario {
        +int id
        +string nome
        +string email
        -string senha
        +Perfil perfil
        +Date criado_em
        +Cadastrar(nome, email, senha)
        +Login(email, senha) token
        +Atualizar(nome, senha)
    }
    class Produto {
        +int id
        +string nome
        +string descricao
        +decimal preco_unitario
        +int quantidade_estoque
        +string imagem
        +boolean ativo
        +ListarAtivos()
        +Criar(...)
        +Editar(...)
        +AlterarAtivo(ativo)
    }
    class Pedido {
        +int id
        +int cliente_id
        +StatusPedido status
        +Date previsao_busca
        +string observacao
        +Date criado_em
        +Criar(cliente, itens, previsao, observacao)
        +Cancelar(cliente)
        +AlterarStatus(novoStatus, admin)
        +ListarItens()
    }
    class PedidoItem {
        +int quantidade
        +decimal preco_unitario
        +decimal subtotal
    }
    class Venda {
        +int id
        +int pedido_id
        +decimal valor_total
        +Date data_venda
        +RegistrarNaTransacao(pedido)
        +ListarTodas()
    }
    class Nota {
        +int id
        +int venda_id
        +string numero
        +string natureza_operacao
        +decimal valor_total
        +StatusNota status
        +string link_pdf
        +Date data_emissao
        +Criar(venda, numero, link)
        +Cancelar()
        +AtualizarLink(link)
    }
    class NotaItem {
        +int quantidade
        +decimal preco_unitario
        +decimal subtotal
    }
    class MovimentacaoEstoque {
        +int id
        +TipoMovimentacao tipo
        +int quantidade
        +string motivo
        +Date data_mov
        +RegistrarEntrada(produto, qtd, origem)
        +RegistrarSaida(produto, qtd, origem)
    }

    class Perfil {
        <<enumeration>>
        cliente
        administrador
    }
    class StatusPedido {
        <<enumeration>>
        pendente
        confirmado
        pronto_retirada
        entregue
        cancelado
    }
    class StatusNota {
        <<enumeration>>
        emitida
        cancelada
    }
    class TipoMovimentacao {
        <<enumeration>>
        entrada
        saida
    }

    Usuario "1" --> "0..*" Pedido : faz
    Pedido "1" *-- "1..*" PedidoItem : contém
    PedidoItem "0..*" --> "1" Produto
    Pedido "1" --> "0..1" Venda : gera
    Venda "1" --> "0..*" Nota : tem
    Nota "1" *-- "1..*" NotaItem : contém
    NotaItem "0..*" --> "1" Produto
    MovimentacaoEstoque "0..*" --> "1" Produto : movimenta
    MovimentacaoEstoque "0..*" --> "0..1" Pedido : origem
    MovimentacaoEstoque "0..*" --> "0..1" Usuario : responsável
    Usuario ..> Perfil
    Pedido ..> StatusPedido
    Nota ..> StatusNota
    MovimentacaoEstoque ..> TipoMovimentacao
```

<details>
<summary><b>🏗️ Como as classes viram código (camadas do backend)</b></summary>

<br>

Cada assunto (usuário, produto, pedido, estoque, venda, nota, admin) tem um arquivo em cada camada:

```mermaid
classDiagram
    direction LR
    class PedidoRoutes {
        POST /pedidos
        GET /pedidos/cliente
        PATCH /pedidos/:id/status
    }
    class PedidoController {
        +Criar(req, res)
        +AlterarStatus(req, res)
    }
    class PedidoService {
        +Criar(cliente_id, dados)
        +AlterarStatus(id, status, usuarioId)
    }
    class PedidoRepository {
        +Inserir(conexao, ...)
        +BuscarParaAtualizar(conexao, id)
        +AtualizarStatus(conexao, id, status)
    }
    class EstoqueService {
        +RegistrarMovimentacao(tipo, produto, qtd, origem, conexao)
    }
    class VendaService {
        +RegistrarNaTransacao(conexao, pedidoId)
    }
    PedidoRoutes --> PedidoController
    PedidoController --> PedidoService
    PedidoService --> PedidoRepository
    PedidoService --> EstoqueService : confirmar / cancelar
    PedidoService --> VendaService : entregar
```

`routes` (endereço e middlewares de login, perfil e Zod) → `controllers` (recebe e responde HTTP) → `services` (regras) → `repositories` (SQL) → MySQL.

</details>

---

## 4. Ciclo de vida do pedido

```mermaid
stateDiagram-v2
    [*] --> pendente : cliente envia o pedido
    pendente --> confirmado : admin confirma (baixa o estoque)
    pendente --> cancelado : cliente ou admin cancela
    confirmado --> pronto_retirada : admin separa
    confirmado --> cancelado : admin cancela (devolve o estoque)
    pronto_retirada --> entregue : cliente retira (gera a venda)
    pronto_retirada --> cancelado : admin cancela (devolve o estoque)
    entregue --> [*]
    cancelado --> [*]
```
