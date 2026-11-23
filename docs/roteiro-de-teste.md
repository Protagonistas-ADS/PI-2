# 🧪 Roteiro de teste do fluxo completo

Passo a passo para conferir o sistema inteiro, do visitante ao administrador, usando os dados de demonstração do [`seed.sql`](../backend/src/database/seed.sql). Leva cerca de **25 minutos**.

Siga **na ordem**: cada parte usa o que a anterior criou. Os valores esperados valem para um banco recém-criado com `schema.sql` + `seed.sql`.

> Este roteiro foi executado de ponta a ponta em 21/11/2026, num banco recém-criado com o seed. Em 22/11/2026, o catálogo e os dados de demonstração foram atualizados: agora há três produtos ativos e um registro inativo para preservar o histórico. Os passos afetados por essa mudança precisam ser revalidados antes de considerar esta versão do roteiro totalmente testada.

---

## ✅ Antes de começar

1. **Recriar o banco** pelo MySQL Workbench (os dados de teste voltam ao estado inicial):
   ```sql
   DROP DATABASE IF EXISTS PI2;
   ```
   Depois execute `backend/src/database/schema.sql` e `backend/src/database/seed.sql`.
2. Subir o **back-end** (`cd backend` → `npm run dev`, porta 3000) e o **front-end** (`cd frontend` → `npm run dev`, porta 5173).
3. Abrir **http://localhost:5173**. Use uma **janela normal** para o cliente e uma **janela anônima** para o administrador: assim as duas sessões ficam abertas ao mesmo tempo.

> [!IMPORTANT]
> As datas do seed são **relativas ao dia em que ele foi rodado** (ex.: "pedido feito há 2 dias"). Se o banco foi criado em outro dia ou em outro mês, os números de "A retirar hoje" e "Vendas de (mês)" podem mudar. Recrie o banco no dia do teste.

| Conta | E-mail | Senha |
|-------|--------|-------|
| 👑 Administrador | `admin@teste.com` | `Admin@123456` |
| 🛒 Cliente | `usuario@gmail.com` | `Cliente@123456` |

**Como usar:** marque ✅ ou ❌ na última coluna. Se algo der ❌, anote o passo e o que apareceu.

---

## A. Visitante (sem login)

| # | Passo | Resultado esperado | ✓ |
|:-:|-------|--------------------|:-:|
| A1 | Abrir `/` | Tela inicial com "Paletes de madeira para a sua operação", CNPJ 30.669.871/0001-63, "Segunda a sexta, das 7h às 18h" e botões **Ver catálogo** e **Falar no WhatsApp** | |
| A2 | Rolar a página | Seções "Nossos paletes", "Como funciona o pedido", "Sobre a S Ferraretto" e "Onde estamos" (com mapa) | |
| A3 | Olhar o rodapé | Telefone, e-mail, endereço, link do WhatsApp, razão social e CNPJ. **Sem** redes sociais | |
| A4 | Clicar em **Falar no WhatsApp** | Abre o WhatsApp (`wa.me/5511964992626`) em outra aba | |
| A5 | Ir em **Catálogo** | 3 produtos ativos, **sem pedir login**: Cavinha R$ 42,00, Euro (EPAL) R$ 48,00 e PBR R$ 65,00 | |
| A6 | Clicar em **Saber mais** no Palete PBR | Janela "Palete PBR" com descrição, preço, "Disponível para pedido" (**sem** o número do estoque, que é só do administrador) e "Voltar ao catálogo". Fecha com **Esc** | |
| A7 | No Palete Euro (EPAL), digitar **100** na quantidade e clicar **Adicionar ao carrinho** | Aviso "100x Palete Euro (EPAL) adicionado ao carrinho." e botão flutuante **Carrinho (100)**. A tela não mostra nem limita pelo estoque: quem confere é o servidor, ao enviar (passo C3) | |
| A8 | No Palete PBR, digitar **10** e clicar **Adicionar ao carrinho** | Aviso "10x Palete PBR adicionado ao carrinho." e botão **Carrinho (110)** | |
| A9 | Clicar em **Carrinho (110)** | Janela "Meu Carrinho": Euro (EPAL) 100 un. (R$ 4.800,00) e PBR 10 un. (R$ 650,00), valor total R$ 5.450,00, botão **Ir para o carrinho e finalizar** | |
| A10 | Clicar em **Ir para o carrinho e finalizar** | Página `/carrinho` com os dois produtos (sem quantidade em estoque), total R$ 5.450,00, campos de data e observação e o botão **Entrar para finalizar** | |
| A11 | Clicar em **Entrar para finalizar** | Aviso "Entre na sua conta (ou crie uma) para finalizar o pedido. Seu carrinho fica guardado." → **OK** leva ao login | |
| A12 | Abrir um endereço que não existe (ex.: `/xyz`) | Página **404** "Página não encontrada" com botão para voltar | |

## B. Cadastro

| # | Passo | Resultado esperado | ✓ |
|:-:|-------|--------------------|:-:|
| B1 | Ir em **Criar Conta** e enviar com um e-mail inválido (ex.: `maria@`) | O formulário avisa que o e-mail é inválido e não cadastra | |
| B2 | Cadastrar **Maria Teste**, `maria.teste@empresa.com.br`, senha `Teste@123` | "Cadastrado com sucesso." e vai para o login (aceita domínios como `.com.br`, `outlook`, `yahoo`) | |
| B3 | Tentar cadastrar o mesmo e-mail de novo | Mensagem de e-mail já cadastrado | |

## C. Cliente (`usuario@gmail.com`)

| # | Passo | Resultado esperado | ✓ |
|:-:|-------|--------------------|:-:|
| C1 | Entrar com senha errada | Alerta "E-mail ou senha inválidos." | |
| C2 | Entrar com `Cliente@123456` (vindo do carrinho, passo A11) | Volta **direto para o carrinho**, com os dois produtos ainda lá | |
| C3 | Clicar em **Enviar pedido** (com as 100 unidades de Palete Euro (EPAL)) | Erro: *No momento não temos essa quantidade de "Palete Euro (EPAL)". Diminua a quantidade ou fale com a loja pelo WhatsApp.* O número do estoque **não aparece**, e o pedido não é criado | |
| C4 | Clicar em **Remover** no Palete Euro (EPAL), escolher uma data de retirada (ex.: depois de amanhã), escrever "Vou buscar com caminhão no fim da tarde." e clicar **Enviar pedido** | "Pedido nº 16 enviado! A loja vai conferir o estoque e confirmar." → **OK** abre Meus Pedidos | |
| C5 | Conferir **Meus Pedidos** | "4 registros": nº 16 (R$ 650,00, Aguardando confirmação, com a data escolhida), nº 15 (pendente), nº 12 (Confirmado) e nº 7 (Entregue) | |
| C6 | Clicar em **Cancelar** no nº 15 → **Confirmar** | O nº 15 vira **Cancelado** e o botão some. Os pedidos confirmados e entregues não têm botão | |
| C7 | Digitar `/admin` na barra de endereço | Volta para o catálogo com o aviso "Área restrita para administradores." | |
| C8 | Abrir **Perfil**, trocar o nome para **Cliente Teste da Silva** e clicar no botão **✓** que aparece embaixo do campo | "Nome atualizado com sucesso!" (o botão **Salvar** de baixo é só para trocar a senha; o e-mail não muda por aqui) | |
| C9 | Clicar em **Sair** | Vai para a tela de login. Abrir `/clientePedidos` depois disso também manda para o login | |

## D. Administrador: pedidos (`admin@teste.com`, janela anônima)

| # | Passo | Resultado esperado | ✓ |
|:-:|-------|--------------------|:-:|
| D1 | Entrar com `Admin@123456` | Cai no **Dashboard** (`/admin`), não no catálogo | |
| D2 | Conferir os cartões | **Pedidos pendentes 3** (13, 14 e 16) · **A retirar hoje 2** · **Estoque baixo 0** · **Vendas de novembro R$ 725,00** (2 pedidos entregues; o cartão mostra o nome do mês atual) | |
| D3 | Em "Pedidos em andamento", conferir o nº 16 | Cliente Teste da Silva (nome trocado no C8), a observação do cliente, a data de retirada, 10 unidades, R$ 650,00, "Aguardando confirmação" | |
| D4 | Clicar em **10 unidades** | Janela "Produtos do pedido nº 16": Palete PBR, quantidade 10, R$ 65,00, valor total R$ 650,00 | |
| D5 | Clicar em **Confirmar** no nº 16 | Aviso "Pedido nº 16 confirmado (estoque baixado)." · pendentes passa a **2** · status **Confirmado** com botões **Marcar pronto** e **Cancelar** | |
| D6 | Clicar em **Marcar pronto** | "Pedido nº 16 marcado como pronto para retirada." · botões **Entregue** e **Cancelar** | |
| D7 | Clicar em **Entregue** | Pergunta "Confirmar que o pedido nº 16 foi retirado por Cliente Teste da Silva? A venda será registrada..." → **Sim, foi entregue** | |
| D8 | Conferir depois da entrega | "Pedido nº 16 entregue (venda registrada)." · **Vendas de novembro R$ 1.375,00** (3 pedidos entregues) | |
| D9 | Na janela do cliente, atualizar **Meus Pedidos** | O nº 16 aparece como **Entregue** | |
| D10 | Ir em **Pedidos** (menu lateral) | **Todos (16)** · Pendentes (2) · Confirmados (2) · Prontos (2) · Entregues (7) · Cancelados (3) · soma de R$ 15.315,00 | |
| D11 | Buscar "Rota Sul" e filtrar por **Entregues** | Só os pedidos 6 e 1 da Transportadora Rota Sul · "Mostrando 2 de 16 pedidos · soma de R$ 3.630,00" | |

## E. Administrador: estoque

| # | Passo | Resultado esperado | ✓ |
|:-:|-------|--------------------|:-:|
| E1 | Ir em **Movimentações** | Histórico com **Todas (25)**. A primeira linha é a saída de 10 Palete PBR, motivo "Confirmação do pedido nº 16", responsável Administrador Teste, origem "Pedido nº 16" | |
| E2 | Abrir a lista de produtos do formulário | Palete PBR com **132 un.** (era 142) | |
| E3 | Escolher **Saída**, Palete Euro (EPAL), quantidade **100**, motivo qualquer, e clicar **Registrar saída** | Não registra: "Estoque insuficiente: há 65 un. deste produto." | |
| E4 | Escolher **Entrada**, Palete Euro (EPAL), quantidade 20, motivo "Chegada de lote do fornecedor" | A prévia mostra "Estoque fica em 85 un." | |
| E5 | Clicar **Registrar entrada** | Entrada de 20 unidades de Palete Euro (EPAL) registrada. Estoque: 65 → 85 un. · histórico com **Todas (26)**, Entradas (9), Manuais (10) | |
| E6 | Voltar ao **Dashboard** | **Estoque baixo 0** · "Nenhum produto com 10 un. ou menos" | |

## F. Administrador: vendas e notas fiscais

| # | Passo | Resultado esperado | ✓ |
|:-:|-------|--------------------|:-:|
| F1 | Ir em **Vendas** | **Todas (7)** · Com nota (4) · Sem nota (3) · total de R$ 7.880,00. A primeira é a venda nº 7 do pedido nº 16, "Sem nota" | |
| F2 | Clicar **Emitir nota** na venda nº 7 e preencher o link `javascript:alert(1)` | Não aceita: "Informe um link válido, começando com http:// ou https://." | |
| F3 | Usar o número **NF-000005** (já existe) com um link `https://...` | A janela mostra "Já existe uma nota com o número NF-000005." | |
| F4 | Trocar para **NF-000006** e link `https://example.com/notas/NF-000006.pdf` → **Registrar nota** | "Nota NF-000006 registrada para a venda nº 7." · Com nota (5) · Sem nota (2) | |
| F5 | Ir em **Notas fiscais** | **Todas (6)** · Emitidas (5) · Canceladas (1) · emitidas somam R$ 5.825,00. NF-000006 no topo, **Emitida**, com "Abrir PDF" | |
| F6 | Na **NF-000004** (sem link), clicar **Adicionar link**, colar `https://example.com/notas/NF-000004.pdf` e clicar **Salvar link** | "Link da nota NF-000004 salvo." e aparece "Abrir PDF" | |
| F7 | Clicar **Cancelar** na NF-000006 → **Sim, cancelar nota** | "Nota NF-000006 cancelada." · Emitidas (4) · Canceladas (2) · em **Vendas**, a venda nº 7 volta a "Sem nota" com o botão **Emitir nota** | |

## G. Administrador: usuários e perfil

| # | Passo | Resultado esperado | ✓ |
|:-:|-------|--------------------|:-:|
| G1 | Ir em **Usuários** | **Todos (9)** · Clientes (8) · Administradores (1). Maria Teste aparece com 0 pedidos. Nenhuma senha aparece | |
| G2 | Em **Ordenar por**, escolher **Maior valor comprado** | Transportadora Rota Sul primeiro, depois Mercado Bom Preço, Marcenaria Irmãos Duarte, Cliente Teste da Silva e Ana Paula Ribeiro | |
| G3 | Abrir **Perfil** | Nome, e-mail `admin@teste.com`, perfil Administrador, data de criação e o formulário de troca de senha | |

## H. Segurança (opcional, para quem quiser ir além)

Pode ser feito pelos arquivos `.http` de [`backend/requests/`](../backend/requests) (extensão REST Client do VS Code) ou por qualquer cliente HTTP.

| # | Teste | Resultado esperado | ✓ |
|:-:|-------|--------------------|:-:|
| H1 | `GET /admin/resumo` sem token | `401` "Token não informado" | |
| H2 | `GET /admin/resumo` com o token do cliente | `403` "Acesso permitido somente para administradores." | |
| H3 | Qualquer rota com o token alterado | `401` "Token inválido" | |
| H4 | `POST /usuarios` com e-mail inválido | `400` "Dados inválidos" com os detalhes | |
| H5 | 6 logins errados seguidos (**faça por último**) | Do 1º ao 5º: `401`. No 6º: `429` "Muitas tentativas de login...". O limite conta **todas** as senhas erradas dos últimos 15 minutos, inclusive a do passo C1: se o C1 foi há menos de 15 minutos, o `429` já aparece na 5ª tentativa. Depois disso, **nenhum login funciona nesse computador por 15 minutos** (ou até reiniciar o back-end) | |
| H6 | Chamada vinda de outro site (cabeçalho `Origin` diferente do `CORS_ORIGIN`) | `403` "Acesso não permitido a partir deste endereço." | |
| H7 | `GET /produtos` e `GET /produtos/:id` sem login | Cada produto vem com `disponivel: true/false` e **sem** `quantidade_estoque` (o número só aparece nas rotas de admin, como `/produtos/todos` e `/estoque`) | |

## I. Celular

| # | Passo | Resultado esperado | ✓ |
|:-:|-------|--------------------|:-:|
| I1 | No navegador, abrir as ferramentas (F12) → modo celular (ex.: 390 × 844) | Tela inicial e catálogo em uma coluna, sem rolagem lateral | |
| I2 | Abrir o menu ☰ | O menu abre e fecha (também com **Esc**) | |
| I3 | Entrar como admin no celular | O menu lateral do painel vira menu ☰ e as tabelas viram cartões | |

---

## 🧾 Resultado

| Parte | OK? | Observações |
|-------|:---:|-------------|
| A. Visitante | | |
| B. Cadastro | | |
| C. Cliente | | |
| D. Admin: pedidos | | |
| E. Admin: estoque | | |
| F. Admin: vendas e notas | | |
| G. Admin: usuários e perfil | | |
| H. Segurança | | |
| I. Celular | | |

Testado por: ______________________ · Data: ___/___/______
