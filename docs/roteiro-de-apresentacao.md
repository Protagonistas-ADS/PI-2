# 🎤 Roteiro de apresentação (demo)

Roteiro para apresentar o PI-2 ao professor e à turma, com **o que mostrar, em que ordem e quem fala**. Tempo total: cerca de **15 minutos** + perguntas. Se o tempo combinado for outro, ajuste os blocos 2 e 3, que são as demonstrações ao vivo.

Tudo usa os dados de demonstração do [`seed.sql`](../backend/src/database/seed.sql). O passo a passo detalhado de cada tela está no [roteiro de teste](roteiro-de-teste.md).

---

## 🗓️ Resumo

| # | Bloco | Quem fala | Tempo |
|:-:|-------|-----------|:-----:|
| 1 | Abertura: o cliente e os problemas | **Yuri Tavares** | 2 min |
| 2 | Jornada do cliente (ao vivo) | **Davi Aurélio de Pontes Lopes** e **Gustavo Henrique Teles** | 4 min |
| 3 | Painel do administrador (ao vivo) | **Yuri Tavares** | 4 min |
| 4 | Banco de dados | **Henrique Domingues** | 2 min |
| 5 | Back-end e segurança | **Antonio Miguel Souza Marques** | 2 min |
| 6 | Fechamento e perguntas | **Yuri Tavares** (todos respondem) | 1 min + perguntas |

---

## ✅ Preparação (no dia, antes de começar)

- [ ] **Recriar o banco PI2** com `schema.sql` + `seed.sql` pelo Workbench **no dia da apresentação**. As datas do seed são relativas ao dia em que ele roda: assim aparece "pedido para retirar hoje" e o cartão de vendas do mês fica certo. Antes, faça um backup se o banco tiver algo que você queira guardar.
- [ ] Subir o back-end (`npm run dev` em `backend/`) e o front-end (`npm run dev` em `frontend/`) e abrir **http://localhost:5173**.
- [ ] Deixar **duas janelas** abertas:
  - **Janela normal**: catálogo, como visitante (sem login).
  - **Janela anônima**: login do admin (`admin@teste.com` / `Admin@123456`) já feito, no Dashboard.
- [ ] Testar a tela no **projetor** (o painel se ajusta a 1366 × 768: os cartões do Dashboard ficam 2 por linha). Se o texto ficar pequeno para quem está no fundo da sala, use o zoom do navegador (Ctrl + +).
- [ ] Deixar o README do GitHub aberto em outra aba (prints e diagramas) como **plano B**, caso algo trave.
- [ ] Fechar notificações (WhatsApp, e-mail) e aumentar o zoom do terminal, se for mostrar código.
- [ ] Combinar quem passa o mouse em cada bloco. Quem fala não precisa ser quem clica.

> [!TIP]
> Ensaiem a demo inteira uma vez, de ponta a ponta, e recriem o banco depois do ensaio. Assim o pedido criado ao vivo será o **nº 16**, como neste roteiro.

---

## 1. Abertura: o cliente e os problemas · **Yuri** · 2 min

**Mostrar:** a tela inicial (`/`).

**Falar:**
- "Nosso cliente é a **S Ferraretto**, de Salto-SP, que comercializa paletes de madeira, principalmente para empresas."
- "Na entrevista e na visita ao armazém, encontramos **três problemas**: falta de divulgação, falta de controle de estoque e falta de um canal de vendas."
- "O sistema resolve os três: uma **vitrine online**, um **canal de pedidos** e um **painel de estoque, vendas e notas**."
- "Atendemos os pedidos do professor: tiramos a cotação, o catálogo abriu sem login, entraram o carrinho e a área completa do administrador."

**Apontar na tela:** CNPJ, horário, botão do WhatsApp e retirada na loja (mostram que a empresa é real e confiável).

---

## 2. Jornada do cliente (ao vivo) · **Davi** e **Gustavo** · 4 min

### 2a. **Davi**: visitante, sem login (2 min)

| Fazer | Falar |
|-------|-------|
| Rolar a tela inicial até o rodapé | "Landing mais direta: produtos, como funciona o pedido, sobre a empresa e o mapa. No rodapé, o CNPJ e o WhatsApp; tiramos as redes sociais." |
| Clicar em **Ver catálogo** | "O catálogo **abre sem login**: qualquer pessoa vê os produtos e os preços." |
| **Saber mais** no Palete PBR → **Esc** | "O 'Saber mais' agora serve só para ver os detalhes: descrição, preço e se está disponível. A quantidade em estoque o cliente não vê: isso é informação só do dono." |
| No Palete Euro (EPAL), digitar **100** e **Adicionar ao carrinho** | "O cliente escolhe a quantidade que quiser. Se pedir mais do que a loja tem, o servidor recusa ao enviar, sem revelar o estoque." |
| PBR: quantidade **10** → **Adicionar ao carrinho** → **Carrinho (110)** → **Ir para o carrinho e finalizar** | "Escolho a quantidade e coloco no carrinho direto do card. O carrinho mostra o total." |
### 2b. **Gustavo**: cliente com login (2 min)

| Fazer | Falar |
|-------|-------|
| Clicar em **Entrar para finalizar** → **OK** | "Para enviar, o site pede login, e **o carrinho fica guardado**." |
| Entrar com `usuario@gmail.com` / `Cliente@123456` | "Depois do login, ele volta **direto para o carrinho**." |
| Clicar em **Enviar pedido** (com as 100 unidades de Palete Euro (EPAL)) | "Pedi mais unidades do que a loja tem: o servidor recusa com uma mensagem clara e **não revela o estoque**. Quantidade é informação só do dono." |
| **Remover** o Palete Euro (EPAL), escolher a data de retirada (depois de amanhã), escrever "Vou buscar com caminhão no fim da tarde." → **Enviar pedido** | "O cliente diz quando vai retirar e deixa um recado para a loja." |
| Ler o aviso "Pedido nº 16 enviado!" → **OK** | "O pedido entra como **aguardando confirmação**." |
| Mostrar **Meus Pedidos** | "Aqui o cliente acompanha tudo: confirmado, pronto, entregue. Ele só cancela enquanto o pedido está pendente." |

**Passar a palavra:** "Agora vamos ver esse mesmo pedido do lado da loja." (O Yuri vai para a janela anônima.)

---

## 3. Painel do administrador (ao vivo) · **Yuri** · 4 min

| Fazer | Falar |
|-------|-------|
| Mostrar o **Dashboard** e clicar em **Atualizar** | "O dono abre o painel e vê o dia: **pedidos pendentes**, o que tem **para retirar hoje**, **estoque baixo** (nenhum produto ativo está com 10 unidades ou menos) e **vendas do mês**." |
| No nº 16, clicar em **10 unidades** → fechar | "Vejo os itens e o recado do cliente." |
| **Confirmar** o nº 16 | "Ao confirmar, **o estoque baixa sozinho**, e tudo acontece numa transação no banco: ou tudo dá certo, ou nada é gravado." |
| Ir em **Movimentações** | "Cada entrada e saída fica registrada: **quem fez, quando, por quê e de qual pedido**. Olha a saída de 10 PBR do pedido nº 16, e o saldo foi de 142 para 132." |
| Voltar ao **Dashboard** → **Marcar pronto** → **Entregue** → **Sim, foi entregue** | "Separei, o cliente retirou: ao marcar entregue, **a venda é criada automaticamente**. As vendas do mês subiram para R$ 1.815." |
| Ir em **Vendas** → **Emitir nota** na venda nº 7 → `NF-000006`, link `https://example.com/notas/NF-000006.pdf` → **Registrar nota** | "A nota é emitida no **Emitte**, que o cliente já usa. Aqui registramos o número e o link do PDF." |
| Ir em **Notas fiscais** | "Notas emitidas e canceladas, com o link do PDF. Se uma nota sai errada, cancelo e emito outra." |
| Mostrar rapidamente **Pedidos** e **Usuários** | "Tabelas completas com busca, filtros e totais: pedidos por status, e clientes com quantos pedidos fizeram e quanto compraram." |

> [!NOTE]
> Se sobrar tempo: em **Movimentações**, tentar uma **saída de 100** paletes Euro para mostrar o aviso "Estoque insuficiente" e depois registrar uma **entrada de 20** ("Chegada de lote do fornecedor"). O estoque do Palete Euro passa de 65 para 85 unidades.

---

## 4. Banco de dados · **Henrique** · 2 min

**Mostrar:** o diagrama do banco em [`docs/diagramas.md`](diagramas.md#1-modelo-do-banco-mer--modelo-lógico) (no GitHub) ou o modelo no BrModelo/Workbench.

**Falar:**
- "São 8 tabelas no MySQL. O coração é **pedido → venda → nota fiscal**, e o **estoque** é controlado pela tabela de **movimentações**."
- "Tiramos tudo de cotação: tabelas, colunas e dados. O status do pedido virou **pendente → confirmado → pronto para retirada → entregue**, ou cancelado."
- "A movimentação guarda o **pedido de origem**, o **responsável** e o **motivo**. A nota tem **status** (emitida/cancelada) e o **link do PDF**."
- "O `seed.sql` cria dados coerentes para testar: 8 usuários, 5 produtos (3 ativos e 2 que saíram de linha, para preservar o histórico), 15 pedidos em todos os status, 6 vendas, 5 notas e 27 movimentações: todas as 8 tabelas têm 5 registros ou mais. **O estoque de cada produto é exatamente a soma das movimentações**."
- "Seguimos a regra de **não guardar atributo derivado**: subtotal e valor total não ficam no banco, são calculados na consulta com `SUM(quantidade * preco_unitario)`. O preço unitário do item fica guardado porque é o preço **do dia da compra**: se o catálogo mudar, o pedido antigo não muda."
- "No `consultas.sql` estão 7 consultas úteis para a loja (faturamento mensal, produtos mais vendidos, melhores clientes, estoque abaixo da média, conferência do estoque...), usando JOIN, WHERE, GROUP BY com HAVING, ORDER BY e subconsulta."
- "Produtos não são apagados, só desativados, para não perder o histórico de pedidos e notas."

---

## 5. Back-end e segurança · **Antonio** · 2 min

**Mostrar:** o diagrama de camadas ([`docs/diagramas.md`](diagramas.md#3-diagrama-de-classes)) ou a pasta `backend/src/` no VS Code.

**Falar:**
- "A API é em **Node.js com Express e TypeScript**, organizada em camadas: rotas → validação → controller → regras de negócio (services) → SQL (repositories)."
- "Toda entrada passa pelo **Zod**: se vier um dado errado, a API responde **400** com a mensagem em português."
- "**Senhas** ficam só como hash **bcrypt**. O login devolve um **token JWT** que vale 8 horas."
- "As **permissões são conferidas no servidor**: sem login dá **401**, cliente tentando rota de admin dá **403**. Esconder um botão não é segurança, então o back-end confere sempre."
- "Também colocamos **limite de tentativas de login** (5 erros em 15 minutos bloqueiam), **CORS** só para o endereço do site e os cabeçalhos de segurança do **Helmet**."

**Demo rápida (opcional, 30 s):** na janela do cliente, digitar `/admin` na barra de endereço → aparece "Área restrita para administradores."

---

## 6. Fechamento · **Yuri** · 1 min

**Falar:**
- "Entregamos o que o professor pediu: **sem cotação**, **catálogo aberto**, **carrinho**, **footer com CNPJ** e a **área do administrador completa**: dashboard, pedidos, notas, vendas, movimentações, usuários e perfil."
- "Ficaram como **melhorias futuras**: telefone no cadastro com texto da LGPD, tela de produtos com upload de foto, testes automatizados e publicar na internet."
- "Toda a documentação está no README: como rodar, prints, diagramas e os roteiros."
- "Obrigado! Estamos abertos a perguntas."

---

## ❓ Perguntas prováveis (e quem responde)

| Pergunta | Resposta curta | Quem |
|----------|----------------|------|
| Por que não tem pagamento online? | O cliente vende mais para empresas, com retirada na loja e nota no Emitte. O pedido pelo site organiza a venda; o pagamento segue como a loja já faz hoje. | Yuri |
| Por que tiraram a cotação? | Foi pedido do professor: um fluxo só (pedido) é mais simples para o cliente e para a loja. | Yuri |
| Como garantem que o estoque não fica errado? | O estoque só muda junto com uma movimentação registrada, dentro de uma **transação** com trava na linha (`FOR UPDATE`): dois admins confirmando ao mesmo tempo não baixam o estoque duas vezes. | Henrique / Antonio |
| E se o cliente pedir mais do que tem? | O servidor confere ao criar o pedido e responde `409` "No momento não temos essa quantidade de ...", **sem dizer o saldo**; confere de novo quando o admin confirma. O catálogo nem recebe o número: a API pública devolve só `disponivel`. | Davi / Antonio |
| Como um administrador é criado? | Por segurança, não existe cadastro de admin pelo site: todo cadastro entra como cliente, e o admin é definido direto no banco. | Antonio |
| A nota fiscal é emitida pelo sistema? | Não: a emissão oficial continua no Emitte. O sistema guarda o número, o status e o link do PDF, ligados à venda. | Gustavo |
| Funciona no celular? | Sim, as telas se adaptam (o menu vira ☰ e as tabelas viram cartões). | Davi |
| O que vocês fariam com mais tempo? | As melhorias futuras do README: LGPD e telefone, upload de fotos, testes automatizados e publicação com HTTPS. | Todos |
| Como o grupo se organizou? | Git com uma branch por etapa, Pull Requests, commits no padrão Conventional Commits e documentação atualizada a cada PR. | Yuri |

---

## 🆘 Se algo der errado

| Problema | O que fazer |
|----------|-------------|
| Tela não carrega dados / "Network Error" | Conferir se o back-end está rodando (terminal) e recarregar a página |
| "Muitas tentativas de login" | Errou a senha 5 vezes: reiniciar o back-end (Ctrl + C → `npm run dev`) |
| O pedido criado não é o nº 16 | Sem problema: siga com o número que apareceu (o banco não foi recriado depois do ensaio) |
| Internet caiu | O sistema roda local; só o mapa da tela inicial precisa de internet. Siga a demo |
| Travou de vez | Abrir o README no GitHub e apresentar pelos prints e diagramas |
