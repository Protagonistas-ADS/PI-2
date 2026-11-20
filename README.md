<a id="topo"></a>

<div align="center">

# 🪵 PI-2 · Catálogo e Venda de Paletes

### Divulgue, venda e controle o estoque de paletes de madeira em um só lugar

Projeto Integrador · FATEC · Análise e Desenvolvimento de Sistemas

<br>

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Entrega](https://img.shields.io/badge/entrega-24%2F11-blue)
![Licença](https://img.shields.io/badge/licença-MIT-green)

<br>

[**🎯 Sobre**](#-sobre-o-projeto) ·
[**✨ Funcionalidades**](#-funcionalidades) ·
[**🏗️ Arquitetura**](#️-arquitetura) ·
[**🔌 API**](#-api-back-end) ·
[**🔐 Segurança**](#-segurança-da-informação) ·
[**🚀 Como rodar**](#-como-rodar-o-projeto) ·
[**📈 Roadmap**](#-status-e-roadmap) ·
[**👥 Equipe**](#-equipe)

</div>

---

## 📑 Sumário

<details>
<summary><b>Clique para expandir o sumário</b></summary>

<br>

- [Sobre o projeto](#-sobre-o-projeto)
- [O problema que resolvemos](#-o-problema-que-resolvemos)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#️-arquitetura)
- [Tecnologias](#️-tecnologias)
- [Banco de dados](#️-banco-de-dados)
- [API (back-end)](#-api-back-end)
- [Telas (front-end)](#️-telas-front-end)
- [Segurança da informação](#-segurança-da-informação)
- [Engenharia de requisitos](#-engenharia-de-requisitos)
- [Como rodar o projeto](#-como-rodar-o-projeto)
- [Estrutura de pastas](#-estrutura-de-pastas)
- [Fluxo de trabalho da equipe](#-fluxo-de-trabalho-da-equipe)
- [Status e roadmap](#-status-e-roadmap)
- [Equipe](#-equipe)
- [Licença](#-licença)

</details>

---

## 🎯 Sobre o projeto

O **PI-2** é uma aplicação web desenvolvida para a **S Ferraretto**, empresa de Salto-SP que comercializa paletes de madeira. O sistema reúne em um só lugar:

| | |
|---|---|
| 🌐 **Divulgação** | Landing page voltada para contato e catálogo de produtos com carrinho |
| 🔄 **Fluxo comercial** | Pedido → venda → nota fiscal |
| 📦 **Estoque** | Saldo por produto e histórico de entradas e saídas |

> [!NOTE]
> O projeto nasceu de uma entrevista com o cliente e de uma visita ao armazém, para entender na prática como a operação funciona hoje.

<div align="right"><a href="#topo">⬆️ voltar ao topo</a></div>

---

## 🧩 O problema que resolvemos

Na entrevista com o cliente, identificamos três dores principais:

| # | Problema | Como o sistema ajuda |
|:-:|----------|----------------------|
| 1️⃣ | **Falta de divulgação** | Landing page e catálogo online, acessíveis a qualquer cliente |
| 2️⃣ | **Falta de gerenciamento de estoque** | Saldo por produto e histórico de movimentações (entrada e saída) |
| 3️⃣ | **Falta de canal de vendas** | Clientes fazem pedidos direto pelo site |

<div align="right"><a href="#topo">⬆️ voltar ao topo</a></div>

---

## ✨ Funcionalidades

<table>
<tr>
<td width="50%" valign="top">

### 👤 Cliente

- 🔑 Cadastro, login e edição de perfil
- 🛍️ Catálogo de paletes aberto (sem login), com quantidade e carrinho direto no card
- 🛒 Página do carrinho (`/carrinho`) com data de retirada e observação
- 📝 Realização de **pedidos** a partir do carrinho (estoque conferido na hora)
- 🔎 Acompanhamento do status dos pedidos (histórico completo)
- ❌ Cancelamento de pedidos enquanto aguardam confirmação

</td>
<td width="50%" valign="top">

### 🛠️ Administrador

- 📦 Gerenciamento de produtos
- 📋 Gerenciamento de pedidos
- 🧾 Histórico de vendas, notas fiscais e movimentações
- 📊 Controle de estoque (entradas e saídas)

</td>
</tr>
</table>

### 🔄 Fluxo comercial

```mermaid
flowchart LR
    A(["👤 Cliente"]) --> B["🛍️ Catálogo<br/>e carrinho"]
    B --> D["📦 Pedido"]
    D -- "entregue" --> E["💰 Venda"]
    E --> F["🧾 Nota fiscal"]
    D -. "confirmado: baixa no estoque" .-> G["📊 Movimentação<br/>de estoque"]
    H(["🛠️ Administrador"]) -. "gerencia" .-> D
    H -.-> G

    style A fill:#dbeafe,stroke:#2563eb,color:#111
    style H fill:#fef3c7,stroke:#d97706,color:#111
    style E fill:#dcfce7,stroke:#16a34a,color:#111
    style F fill:#dcfce7,stroke:#16a34a,color:#111
```

<details>
<summary><b>🔁 Ciclo de vida de um pedido</b></summary>

<br>

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

O cliente só cancela pelo site enquanto o pedido está **pendente**. Depois de confirmado, só o administrador cancela.

</details>

> [!NOTE]
> O andamento de cada item está na seção [Status e roadmap](#-status-e-roadmap).

<div align="right"><a href="#topo">⬆️ voltar ao topo</a></div>

---

## 🏗️ Arquitetura

```mermaid
flowchart LR
    U([👤 Usuário]) --> F["🖥️ Front-end<br/>React + Vite"]
    F -- "HTTP · JSON<br/>Axios + JWT" --> B["⚙️ Back-end<br/>Node + Express"]
    B --> DB[("🗄️ MySQL")]

    style F fill:#dbeafe,stroke:#2563eb,color:#111
    style B fill:#dcfce7,stroke:#16a34a,color:#111
    style DB fill:#fef3c7,stroke:#d97706,color:#111
```

O back-end segue uma arquitetura em camadas, em que cada camada tem uma única responsabilidade:

```mermaid
flowchart LR
    R["🛣️ routes"] --> M["🛡️ middlewares<br/>auth · schema"] --> C["🎮 controllers"] --> S["🧠 services<br/>regras de negócio"] --> RP["🗃️ repositories<br/>SQL"] --> DB[("🗄️ MySQL")]
```

| Camada | Responsabilidade |
|--------|------------------|
| `routes` | Define os endpoints e quais middlewares cada um usa |
| `middlewares` | Autenticação (JWT), autorização por perfil, validação (Zod) e tratamento de erros |
| `controllers` | Recebe a requisição e devolve a resposta HTTP |
| `services` | Regras de negócio e validações |
| `repositories` | Consultas SQL ao banco |
| `schemas` | Esquemas de validação dos dados de entrada (Zod) |

<details>
<summary><b>🔑 Como funciona o login (sequência)</b></summary>

<br>

```mermaid
sequenceDiagram
    actor U as Usuário
    participant F as Front-end
    participant B as Back-end
    participant D as MySQL

    U->>F: e-mail e senha
    F->>B: POST /usuarios/login
    B->>D: busca o usuário pelo e-mail
    D-->>B: usuário e hash da senha
    B->>B: bcrypt compara a senha
    B-->>F: token JWT (válido por 8h)
    F->>B: GET /pedidos/cliente (Bearer token)
    B->>B: valida o token e confere o usuário
    B-->>F: dados do cliente logado
```

</details>

<div align="right"><a href="#topo">⬆️ voltar ao topo</a></div>

---

## 🛠️ Tecnologias

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Styled Components](https://img.shields.io/badge/Styled%20Components-DB7093?logo=styledcomponents&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white)
![React Router](https://img.shields.io/badge/React%20Router-CA4245?logo=reactrouter&logoColor=white)
<br>
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white)
<br>
![VS Code](https://img.shields.io/badge/VS%20Code-007ACC?logo=visualstudiocode&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white)

<table>
<tr>
<td width="50%" valign="top">

**🖥️ Front-end**

| Tecnologia | Uso |
|------------|-----|
| React 19 + TypeScript | Interface |
| Vite | Build e servidor de desenvolvimento |
| React Router | Rotas públicas e protegidas |
| Styled Components | Estilização |
| Axios | Comunicação com a API |
| SweetAlert2 e React Toastify | Alertas e notificações |
| React Icons | Ícones |

</td>
<td width="50%" valign="top">

**⚙️ Back-end**

| Tecnologia | Uso |
|------------|-----|
| Node.js + Express 5 + TypeScript | Servidor da API |
| MySQL + mysql2 | Banco de dados |
| JSON Web Token | Autenticação |
| bcrypt | Criptografia de senhas |
| Zod | Validação de dados |
| dotenv e cors | Variáveis de ambiente e CORS |

</td>
</tr>
</table>

**🧰 Ferramentas:** VS Code · MySQL Workbench · BrModelo · Git e GitHub

<div align="right"><a href="#topo">⬆️ voltar ao topo</a></div>

---

## 🗄️ Banco de dados

O banco se chama `PI2`. O script completo está em [`backend/src/database/schema.sql`](backend/src/database/schema.sql) e há dados de teste em [`seed.sql`](backend/src/database/seed.sql).

```mermaid
erDiagram
    USUARIO ||--o{ PEDIDO : faz
    PEDIDO ||--|{ PEDIDO_ITEM : contem
    PEDIDO ||--o| VENDA : gera
    VENDA ||--o| NOTA : emite
    NOTA ||--|{ NOTA_ITEM : contem
    PRODUTO ||--o{ PEDIDO_ITEM : "aparece em"
    PRODUTO ||--o{ NOTA_ITEM : "aparece em"
    PRODUTO ||--o{ MOVIMENTACAO_ESTOQUE : movimenta
    NOTA ||--o{ MOVIMENTACAO_ESTOQUE : origina
```

<details>
<summary><b>📚 Dicionário das tabelas</b></summary>

<br>

| Tabela | Descrição |
|--------|-----------|
| `usuario` | Clientes e administradores (`perfil`) |
| `produto` | Paletes do catálogo, com preço e saldo em estoque |
| `pedido` / `pedido_item` | Pedidos e seus itens, com data prevista de retirada e observação. Status: pendente, confirmado, pronto_retirada, entregue, cancelado |
| `venda` | Venda gerada a partir de um pedido |
| `nota` / `nota_item` | Nota fiscal da venda e seus itens |
| `movimentacao_estoque` | Histórico de entradas e saídas por produto |

</details>

<div align="right"><a href="#topo">⬆️ voltar ao topo</a></div>

---

## 🔌 API (back-end)

Rotas marcadas com 🔒 exigem o header `Authorization: Bearer <token>`.

**Legenda:** 🟢 `GET` · 🔵 `POST` · 🟣 `PUT` · 🟠 `PATCH`

<details open>
<summary><b>👤 Usuários</b></summary>

<br>

| Método | Rota | Descrição | Auth |
|:------:|------|-----------|:----:|
| 🔵 `POST` | `/usuarios` | Cadastro de usuário | |
| 🔵 `POST` | `/usuarios/login` | Login (retorna o token JWT) | |
| 🟢 `GET` | `/usuarios/logado` | Dados do usuário logado | 🔒 |
| 🟠 `PATCH` | `/usuarios` | Atualizar nome e senha | 🔒 |

</details>

<details open>
<summary><b>📦 Produtos</b></summary>

<br>

| Método | Rota | Descrição | Auth |
|:------:|------|-----------|:----:|
| 🟢 `GET` | `/produtos` | Catálogo: lista os produtos **ativos** | 🌐 |
| 🟢 `GET` | `/produtos/:id` | Detalhes de um produto ativo (`404` se não existir ou estiver desativado) | 🌐 |
| 🟢 `GET` | `/produtos/todos` | Lista todos os produtos, inclusive os desativados | 🔒 admin |
| 🔵 `POST` | `/produtos` | Cadastrar produto `{ nome, descricao, preco, quantidade, imagem? }` → `201 { id }` | 🔒 admin |
| 🟣 `PUT` | `/produtos/:id` | Editar produto (mesmo corpo do cadastro) → `204` | 🔒 admin |
| 🟠 `PATCH` | `/produtos/:id/ativo` | Ativar/desativar `{ "ativo": false }` → `204` | 🔒 admin |

Produtos não são apagados: desativar tira o produto do catálogo, mas preserva pedidos, vendas e notas antigos. O campo `imagem` guarda só o nome do arquivo da pasta `backend/uploads` (servida em `/uploads/<arquivo>`).

</details>

<details open>
<summary><b>🛒 Pedidos</b></summary>

<br>

| Método | Rota | Descrição | Auth |
|:------:|------|-----------|:----:|
| 🔵 `POST` | `/pedidos` | Criar pedido → `201 { pedidoId }` | 🔒 cliente |
| 🟢 `GET` | `/pedidos/cliente` | Pedidos do cliente logado (todos os status, com `valor_total`) | 🔒 cliente |
| 🟢 `GET` | `/pedidos/itens/:id` | Itens de um pedido do próprio cliente | 🔒 cliente |
| 🟠 `PATCH` | `/pedidos/cancelar/:id` | Cancelar pedido (só `pendente`) → `204` | 🔒 cliente |
| 🟢 `GET` | `/pedidos` | Todos os pedidos, com nome e e-mail do cliente | 🔒 admin |
| 🟠 `PATCH` | `/pedidos/:id/status` | Mudar status `{ "status": "confirmado" }` → `200 { id, status_anterior, status }` | 🔒 admin |

Corpo de `POST /pedidos`:

```json
{
  "itens": [{ "produto_id": 1, "quantidade": 10 }],
  "previsao_busca": "2026-11-25",
  "observacao": "Vou buscar com caminhão no fim da tarde."
}
```

- `previsao_busca` (opcional): data `AAAA-MM-DD`, de hoje até 60 dias. `observacao` (opcional): até 500 caracteres.
- Estoque insuficiente ou produto desativado → `409` com o nome do produto. Produto inexistente → `404`.
- Status: `pendente → confirmado → pronto_retirada → entregue`, ou `cancelado`. Mudança fora dessa ordem → `409`.
- **Confirmar** baixa o estoque (saída); **cancelar** um pedido confirmado devolve (entrada); **entregar** registra a venda. Tudo na mesma transação.

</details>

<details open>
<summary><b>💰 Vendas</b> (somente administrador)</summary>

<br>

| Método | Rota | Descrição | Auth |
|:------:|------|-----------|:----:|
| 🔵 `POST` | `/vendas` | Registrar a venda de um pedido `entregue` que ficou sem venda `{ "pedido_id": 3 }` | 🔒 admin |

Pedidos marcados como entregues pelo sistema já ganham a venda sozinhos; esta rota serve para pedidos antigos. Não mexe no estoque (ele baixou na confirmação).

</details>

<details open>
<summary><b>📊 Estoque</b> (somente administrador)</summary>

<br>

| Método | Rota | Descrição | Auth |
|:------:|------|-----------|:----:|
| 🟢 `GET` | `/estoque` | Saldo atual de todos os produtos | 🔒 admin |
| 🟢 `GET` | `/estoque/movimentacoes` | Histórico de entradas e saídas | 🔒 admin |
| 🟢 `GET` | `/estoque/movimentacoes/:id` | Saldo e histórico de um produto | 🔒 admin |
| 🔵 `POST` | `/estoque/entrada` | Registrar entrada `{ produto_id, quantidade }` | 🔒 admin |
| 🔵 `POST` | `/estoque/saida` | Registrar saída manual `{ produto_id, quantidade }` | 🔒 admin |

Cada entrada ou saída atualiza o saldo do produto e grava o histórico na mesma transação. Saída maior que o saldo retorna `409`.

</details>

<details>
<summary><b>⚠️ Formato dos erros</b></summary>

<br>

Erros seguem o formato `{ "erro": "mensagem" }`, sempre em português. Erros de validação (Zod) retornam `400` com os detalhes em `detalhes`. Os códigos usados: `400` dados inválidos (inclusive JSON mal formado), `401` sem login, `403` sem permissão, `404` não encontrado (inclusive rota inexistente), `409` conflito com a regra de negócio (ex.: estoque insuficiente), `500` erro interno.

```json
{
  "erro": "Dados inválidos",
  "detalhes": [ ... ]
}
```

</details>

<div align="right"><a href="#topo">⬆️ voltar ao topo</a></div>

---

## 🖥️ Telas (front-end)

| Rota | Tela | Acesso |
|------|------|:------:|
| `/` | Tela inicial (landing page com contatos) | 🌐 Pública |
| `/cadastro` | Cadastro de usuário | 🌐 Pública |
| `/login` | Login | 🌐 Pública |
| `/catalogo` | Catálogo de produtos e carrinho (login só para finalizar o pedido) | 🌐 Pública |
| `/carrinho` | Carrinho: revisar itens, data de retirada, observação e enviar o pedido | 🌐 Pública (envio exige login de cliente) |
| `/perfil` | Perfil do usuário | 🔒 Logado |
| `/clientePedidos` | Meus Pedidos (acompanhamento dos pedidos) | 🔒 Logado |

<div align="right"><a href="#topo">⬆️ voltar ao topo</a></div>

---

## 🔐 Segurança da informação

<details open>
<summary><b>✅ O que já está implementado</b></summary>

<br>

| Área | Prática adotada |
|------|-----------------|
| 🔑 **Senhas** | Armazenadas apenas como hash **bcrypt** (10 rounds), nunca em texto puro |
| 🎫 **Autenticação** | **JWT** com expiração de 8 horas, validado a cada requisição; o usuário é conferido no banco, então um usuário removido perde o acesso |
| 🛂 **Autorização** | Perfis `cliente` e `administrador`, com middleware próprio para rotas de admin |
| 💉 **Injeção de SQL** | Todas as consultas usam *prepared statements* (`?`) do mysql2 |
| 🧹 **Validação de entrada** | Todo corpo de requisição passa por esquemas **Zod** antes de chegar ao controller |
| 👥 **Cadastro seguro** | O perfil de quem se cadastra é sempre `cliente`, definido no servidor e não pelo cliente da API |
| 🧱 **Isolamento de dados** | Pedidos são sempre filtrados pelo `cliente_id` do token, então um cliente não acessa dados de outro |
| 🚪 **Login** | Mensagem genérica ("e-mail ou senha inválidos"), sem revelar qual dos dois está errado |
| 🙈 **Respostas** | O hash da senha nunca é devolvido pela API; erros inesperados retornam mensagem genérica (`500`) |
| 🗝️ **Segredos** | Credenciais ficam no `.env`, que está no `.gitignore`; o repositório traz apenas o `.env.example` |
| 🔗 **Integridade** | Chaves estrangeiras e restrições `UNIQUE`/`NOT NULL` no banco |

</details>

<details open>
<summary><b>🛣️ Melhorias previstas</b></summary>

<br>

- [ ] Restringir o **CORS** ao domínio do front-end em produção
- [ ] Adicionar **rate limiting** no login e cabeçalhos de segurança com **Helmet**
- [x] Aplicar o middleware de administrador nas rotas de gestão (produtos, estoque, notas e vendas)
- [ ] Fortalecer a política de senhas (tamanho mínimo e complexidade)
- [ ] Servir tudo por **HTTPS** e usar um `JWT_SECRET` longo e aleatório
- [ ] Avaliar o armazenamento do token (hoje em `localStorage`) e criar um usuário de banco com privilégios mínimos
- [ ] Adequação à **LGPD**: coletar apenas os dados necessários e definir regras de retenção

</details>

<div align="right"><a href="#topo">⬆️ voltar ao topo</a></div>

---

## 📋 Engenharia de requisitos

Antes de codificar, a equipe levantou os requisitos com o cliente:

- 🎤 Entrevista com o proprietário e **visita ao armazém** para entender a operação
- 📄 Relatório de levantamento de requisitos
- 🧭 Diagrama de casos de uso
- 🧱 Diagrama de classes
- 🗄️ Modelagem do banco (MER no BrModelo, depois modelo lógico e físico no MySQL Workbench)

> [!NOTE]
> Hoje a emissão de notas fiscais é feita pelo site **Emitte**, com clientes, produtos e transportadoras cadastrados. O sistema registra a venda e a nota para manter o estoque e o histórico organizados.

<div align="right"><a href="#topo">⬆️ voltar ao topo</a></div>

---

## 🚀 Como rodar o projeto

O projeto tem duas aplicações independentes, **back-end** (API) e **front-end** (site), que precisam estar rodando ao mesmo tempo. Em resumo:

```mermaid
flowchart LR
    A["1️⃣ Clonar"] --> B["2️⃣ Criar<br/>o banco"] --> C["3️⃣ Back-end<br/>.env + npm run dev"] --> D["4️⃣ Front-end<br/>.env + npm run dev"] --> E["5️⃣ Acessar<br/>no navegador"]

    style A fill:#dbeafe,stroke:#2563eb,color:#111
    style B fill:#dbeafe,stroke:#2563eb,color:#111
    style C fill:#dcfce7,stroke:#16a34a,color:#111
    style D fill:#dcfce7,stroke:#16a34a,color:#111
    style E fill:#fef3c7,stroke:#d97706,color:#111
```

### 📋 Pré-requisitos

| Ferramenta | Versão | Para que serve | Como conferir |
|------------|--------|----------------|---------------|
| [Git](https://git-scm.com) | Qualquer recente | Clonar o repositório | `git --version` |
| [Node.js](https://nodejs.org) | LTS recente (22 ou superior recomendado) | Rodar back-end e front-end | `node --version` |
| npm | Já vem com o Node.js | Instalar dependências | `npm --version` |
| [MySQL Server](https://dev.mysql.com/downloads/mysql/) | 8 ou superior | Banco de dados | `mysql --version` |
| [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) | Opcional | Executar os scripts SQL com interface | |

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/Protagonistas-ADS/PI-2.git
cd PI-2
```

### 2️⃣ Criar o banco de dados

Os scripts ficam em `backend/src/database/`:

| Arquivo | O que faz | Obrigatório |
|---------|-----------|:-----------:|
| `schema.sql` | Cria o banco `PI2` e todas as tabelas | ✅ |
| `seed.sql` | Insere dados de teste (usuários, produtos, pedidos, venda e nota) | Opcional |
| `migracao-remover-cotacao.sql` | Só para quem já tinha o banco antigo: remove as tabelas de cotação sem mexer no resto | Só se o banco é antigo |
| `migracao-imagens-produto.sql` | Só para quem já tinha o seed antigo: corrige o caminho das imagens dos produtos | Só se o banco é antigo |
| `migracao-status-pedido.sql` | Só para quem já tinha o banco antigo: novo fluxo de status do pedido (tira o `respondido`) e coluna `observacao` | Só se o banco é antigo |
| `migracao-imagem-padrao-produto.sql` | Só para quem já tinha o seed antigo: tira o logo da equipe das fotos dos produtos (o site mostra a foto padrão de paletes) | Só se o banco é antigo |

<details open>
<summary><b>Opção A: MySQL Workbench</b></summary>

<br>

1. Abra uma conexão com o seu servidor MySQL.
2. Menu **File → Open SQL Script** e escolha o `schema.sql`.
3. Clique no raio ⚡ para executar.
4. Repita com o `seed.sql` (se quiser os dados de teste).

</details>

<details>
<summary><b>Opção B: terminal</b></summary>

<br>

```bash
mysql -u SEU_USUARIO -p < backend/src/database/schema.sql
mysql -u SEU_USUARIO -p < backend/src/database/seed.sql
```

</details>

Para conferir se deu certo:

```sql
USE PI2;
SHOW TABLES;
```

### 3️⃣ Configurar e rodar o back-end

```bash
cd backend
npm install
```

Crie o arquivo `.env` a partir do exemplo:

| Sistema | Comando |
|---------|---------|
| 🐧🍎 Linux, macOS e Git Bash | `cp .env.example .env` |
| 🪟 Windows (PowerShell ou CMD) | `copy .env.example .env` |

Preencha o `.env` com os seus dados:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=PI2
DB_USER=root
DB_PASS=sua_senha_do_mysql
JWT_SECRET=uma_chave_longa_e_aleatoria
```

| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta em que a API vai rodar |
| `DB_HOST` | Endereço do MySQL (`localhost` na sua máquina) |
| `DB_PORT` | Porta do MySQL (padrão `3306`) |
| `DB_NAME` | Nome do banco (`PI2`) |
| `DB_USER` | Usuário do MySQL |
| `DB_PASS` | Senha do MySQL |
| `JWT_SECRET` | Chave usada para assinar os tokens de login. Use um texto longo e aleatório e **nunca** compartilhe |

> [!WARNING]
> O arquivo `.env` guarda segredos e **não deve ser enviado ao GitHub**. Ele já está no `.gitignore`.

Inicie o servidor:

```bash
npm run dev
```

Se tudo estiver certo, o terminal mostra:

```text
Conexão com o banco estabelecida.
Servidor rodando em http://localhost:3000
```

### 4️⃣ Configurar e rodar o front-end

Abra um **segundo terminal** (deixe o back-end rodando no primeiro):

```bash
cd frontend
npm install
```

Crie o `.env`:

| Sistema | Comando |
|---------|---------|
| 🐧🍎 Linux, macOS e Git Bash | `cp .env.example .env` |
| 🪟 Windows (PowerShell ou CMD) | `copy .env.example .env` |

```env
VITE_API_URL=http://localhost:3000
```

> [!TIP]
> A URL precisa ter a mesma porta definida no `PORT` do back-end. Se mudar o `.env` do front, reinicie o `npm run dev`.

Depois:

```bash
npm run dev
```

### 5️⃣ Acessar o sistema

Abra no navegador o endereço que o Vite mostrar no terminal (normalmente **http://localhost:5173**).

| Serviço | Endereço padrão |
|---------|-----------------|
| 🖥️ Front-end | http://localhost:5173 |
| ⚙️ Back-end (API) | http://localhost:3000 |

Para testar, crie uma conta pela tela de **Cadastro**. Todo cadastro novo entra com o perfil `cliente`.

<details>
<summary><b>👑 Criando um administrador (ambiente de desenvolvimento)</b></summary>

<br>

Por segurança, não existe cadastro de admin pela API. Crie uma conta normalmente e promova ela direto no banco:

```sql
USE PI2;
UPDATE usuario SET perfil = 'administrador' WHERE email = 'seu-email@exemplo.com';
```

</details>

<details>
<summary><b>📜 Scripts disponíveis</b></summary>

<br>

| Pasta | Comando | O que faz |
|-------|---------|-----------|
| `backend` | `npm run dev` | Servidor com recarga automática |
| `backend` | `npm run build` | Compila o TypeScript para a pasta `dist` |
| `frontend` | `npm run dev` | Servidor de desenvolvimento |
| `frontend` | `npm run build` | Gera o build de produção |
| `frontend` | `npm run preview` | Visualiza o build de produção |
| `frontend` | `npm run lint` | Verifica o código com ESLint |

</details>

<details>
<summary><b>🛟 Problemas comuns</b></summary>

<br>

| Mensagem ou sintoma | Causa provável | Como resolver |
|---------------------|----------------|---------------|
| `Variáveis de ambiente faltando` | `.env` do back-end ausente ou incompleto | Confira se o arquivo existe em `backend/` e se as 5 variáveis `DB_*` estão preenchidas |
| `JWT_SECRET não configurada` | Falta o `JWT_SECRET` no `.env` | Adicione a variável e reinicie o servidor |
| `Access denied for user` | Usuário ou senha do MySQL errados | Revise `DB_USER` e `DB_PASS` |
| `Unknown database 'PI2'` | O `schema.sql` não foi executado | Execute o script do passo 2 |
| `ECONNREFUSED` ao conectar no banco | MySQL desligado ou porta errada | Inicie o serviço do MySQL e confira `DB_PORT` |
| `EADDRINUSE` | A porta já está em uso | Troque o `PORT` no `.env` (e o `VITE_API_URL` no front) |
| Front não carrega dados ou dá `Network Error` | Back-end desligado ou `VITE_API_URL` errada | Confirme que o back está rodando e a URL no `.env` do front; reinicie o `npm run dev` do front após mudar o `.env` |
| Login funciona, mas volta para a tela de login | Token inválido ou expirado | Faça login de novo (o token dura 8 horas) |

</details>

<div align="right"><a href="#topo">⬆️ voltar ao topo</a></div>

---

## 📂 Estrutura de pastas

<details open>
<summary><b>Ver a árvore do projeto</b></summary>

<br>

```text
PI-2/
├── 📁 backend/
│   └── src/
│       ├── configs/        # conexão com o banco
│       ├── controllers/
│       ├── database/       # schema.sql e seed.sql
│       ├── middlewares/
│       ├── repositories/
│       ├── routes/
│       ├── schemas/        # validações Zod
│       ├── services/
│       ├── types/
│       ├── utils/
│       ├── app.ts
│       └── index.ts
├── 📁 frontend/
│   └── src/
│       ├── assets/
│       ├── components/     # componentes reutilizáveis
│       ├── pages/          # Cliente/ e Compartilhadas/
│       ├── routes/
│       ├── services/       # chamadas à API
│       ├── utils/
│       └── App.tsx
└── 📄 README.md
```

</details>

<div align="right"><a href="#topo">⬆️ voltar ao topo</a></div>

---

## 🤝 Fluxo de trabalho da equipe

```mermaid
gitGraph
    commit id: "main"
    branch feat/nomeDaTarefa
    checkout feat/nomeDaTarefa
    commit id: "feat: ..."
    commit id: "fix: ..."
    checkout main
    merge feat/nomeDaTarefa id: "Pull Request"
```

- 🌳 A branch **`main`** é a versão oficial do projeto.
- 🔀 Cada tarefa é feita em uma branch própria, como `feat/nomeDaTarefa`, e entra na `main` por **Pull Request**.
- ✍️ Os commits seguem o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/):

| Prefixo | Uso |
|---------|-----|
| ✨ `feat:` | Nova funcionalidade |
| 🐛 `fix:` | Correção de bug |
| ♻️ `refactor:` | Melhoria de código sem mudar o comportamento |
| 📝 `docs:` | Documentação |
| 🔧 `chore:` | Manutenção (dependências, configs) |

<details>
<summary><b>💡 Exemplo de ciclo completo</b></summary>

<br>

```bash
git checkout main
git pull origin main
git checkout -b feat/rotasEstoque

# ...desenvolve...

git add .
git commit -m "feat: adiciona rotas de listagem de estoque"
git push -u origin feat/rotasEstoque
# abre o Pull Request no GitHub
```

</details>

<div align="right"><a href="#topo">⬆️ voltar ao topo</a></div>

---

## 📈 Status e roadmap

Legenda: ✅ pronto · 🚧 em andamento · ⏳ a fazer

| Área | Progresso | Módulos prontos |
|------|-----------|:---------------:|
| ⚙️ Back-end | `▰▰▰▱▱▱▱` | 3 de 7 |
| 🖥️ Front-end | `▰▰▰▰▱` | 4 de 5 |

<table>
<tr>
<td width="50%" valign="top">

### ⚙️ Back-end

| Módulo | Status |
|--------|:------:|
| Usuário (cadastro, login, perfil) | ✅ |
| Middlewares (token, perfil admin, validação, erros) | ✅ |
| Pedido (visão do cliente) | ✅ |
| Produto (catálogo público, cadastro, edição, ativar/desativar) | ✅ |
| Estoque e movimentações | 🚧 |
| Pedido (visão do admin: listar e mudar status) | ✅ |
| Venda (automática na entrega) | ✅ |
| Nota fiscal | ⏳ |

</td>
<td width="50%" valign="top">

### 🖥️ Front-end

| Tela | Status |
|------|:------:|
| Tela inicial, cadastro e login | ✅ |
| Catálogo e carrinho | ✅ |
| Página do carrinho e envio do pedido | ✅ |
| Perfil do usuário | ✅ |
| Meus Pedidos do cliente | ✅ |
| Dashboard e tabelas do administrador | ⏳ |

</td>
</tr>
</table>

**💡 Ideias futuras:** gerenciamento de compras, perfil de RH para colaboradores, gerenciamento de entregas e frete.

### 🗓️ Cronograma

```mermaid
gantt
    title Cronograma do projeto
    dateFormat YYYY-MM-DD
    axisFormat %d/%m
    section Planejamento
    Escopo, diagramas, protótipo e MER   :done, plan, 2026-08-27, 2026-10-01
    section Desenvolvimento
    APIs, login, catálogo e perfil       :done, dev, 2026-10-15, 2026-11-14
    Dashboard e tabelas do admin         :active, adm, 2026-11-15, 2026-11-21
    section Finalização
    Testes do fluxo completo             :tst, 2026-11-22, 2026-11-23
    Entrega do projeto                   :milestone, ent, 2026-11-24, 0d
```

| Período | Entrega |
|---------|---------|
| 27/08 a 01/10 | Planejamento, escopo, diagramas, protótipo de telas, banco (MER) |
| 15/10 a 14/11 | Desenvolvimento: APIs, login, catálogo, perfil, pedidos e cotações |
| 15/11 a 21/11 | Dashboard e tabelas do administrador |
| 22/11 a 23/11 | Testes do fluxo completo |
| **24/11** | **🏁 Entrega do projeto** |

<div align="right"><a href="#topo">⬆️ voltar ao topo</a></div>

---

## 👥 Equipe

<div align="center">

| 👨‍💻 | 👨‍💻 | 👨‍💻 | 👨‍💻 | 👨‍💻 |
|:---:|:---:|:---:|:---:|:---:|
| **Yuri Tavares** | **Antonio Miguel Souza Marques** | **Davi Aurélio de Pontes Lopes** | **Gustavo Henrique Teles** | **Henrique Domingues** |
| ⚙️ Back-end<br>Rotas de estoque | ⚙️ Back-end<br>Rotas de cotação | 🖥️ Front-end<br>🗄️ Banco de dados<br>👤 Rotas de usuário | 🖥️ Front-end<br>🗄️ Banco de dados<br>🛒 Pedido, venda e nota fiscal | 🗄️ Banco de dados<br>📦 Rotas de produto |

</div>

| Área | Integrantes |
|------|-------------|
| ⚙️ Back-end | Yuri Tavares, Antonio Miguel Souza Marques |
| 🖥️ Front-end | Davi Aurélio de Pontes Lopes, Gustavo Henrique Teles |
| 🗄️ Banco de dados | Henrique Domingues, Gustavo Henrique Teles, Davi Aurélio de Pontes Lopes |

<div align="right"><a href="#topo">⬆️ voltar ao topo</a></div>

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja o arquivo [`LICENSE`](LICENSE).

---

<div align="center">

Feito com 💛 pela equipe **Protagonistas ADS** · FATEC

⭐ Se o projeto te interessou, deixe uma estrela no repositório!

</div>
