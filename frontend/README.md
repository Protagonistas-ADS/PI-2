# Front-end · PI-2 (S Ferraretto)

Site do catálogo e do painel do administrador, feito com **React 19 + TypeScript + Vite**.

> A documentação completa do projeto (funcionalidades, telas, API, banco, diagramas e equipe) está no [README principal](../README.md).

## Como rodar

1. Crie o arquivo `.env` nesta pasta (use o `.env.example` como modelo):

   ```env
   VITE_API_URL=http://localhost:3000
   ```

2. Instale as dependências e suba o servidor:

   ```bash
   npm install
   npm run dev
   ```

3. Abra **http://localhost:5173**. O back-end precisa estar rodando ao mesmo tempo.

## Scripts

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Confere os tipos (`tsc --noEmit`) e gera o build de produção em `dist/` |
| `npm run typecheck` | Só confere os tipos, sem gerar arquivos |
| `npm run lint` | Analisa o código `.ts/.tsx` com o **oxlint** (regras em `.oxlintrc.json`) |
| `npm run preview` | Abre o build de produção localmente |

## Pastas de `src/`

| Pasta | Conteúdo |
|-------|----------|
| `pages/` | Telas: `Compartilhadas/` (inicial, login, cadastro, 404), `Cliente/` (catálogo, carrinho, pedidos, perfil) e `Admin/` (dashboard e tabelas) |
| `components/` | Peças reutilizáveis (navbar, rodapé, janelas, rotas protegidas) |
| `hooks/` | `useCarrinho` (persistência e sincronização do carrinho) e `useAcoesPedidoAdmin` (ações administrativas de pedidos) |
| `services/` | Chamadas à API com Axios |
| `types/` | Tipos compartilhados (usuário, produto, pedido, estoque, venda, nota, admin) |
| `utils/` | Funções de apoio (mensagens de erro, filtros, formatação) |
| `routes/` | Mapa de rotas públicas, de cliente e de administrador |
