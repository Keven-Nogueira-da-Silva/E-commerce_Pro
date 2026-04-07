# ShopAngular — Frontend Angular para E-commerce

> Projeto Angular 17 profissional que consome todas as rotas da API REST de e-commerce em Java (Spring Boot + JWT).

## Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Angular | 17 | Framework principal (Standalone Components) |
| Angular Material | 17 | Biblioteca de componentes UI |
| TypeScript | 5.x | Linguagem principal |
| SCSS | — | Estilização customizada |
| RxJS | 7.x | Programação reativa |
| Inter (Google Fonts) | — | Tipografia profissional |

## Pré-requisitos

- **Node.js** >= 18
- **pnpm** >= 8 (ou npm/yarn)
- **Angular CLI** >= 17
- **Backend Java** rodando em `http://localhost:8080`

## Instalação e Execução

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar URL da API (se necessário)
# Edite: src/environments/environment.ts
# Altere: apiUrl: 'http://localhost:8080/api'

# 3. Iniciar servidor de desenvolvimento
pnpm start

# Acesse: http://localhost:4200
```

## Build para Produção

```bash
pnpm build
# Arquivos gerados em: dist/ecommerce-frontend/
```

## Estrutura do Projeto

```
src/app/
├── core/
│   ├── models/          # Interfaces TypeScript (DTOs)
│   ├── services/        # Serviços HTTP (Auth, Product, Cart, Order, Payment)
│   ├── guards/          # Guards de rota (authGuard, adminGuard, guestGuard)
│   └── interceptors/    # Interceptor JWT automático
├── features/
│   ├── auth/            # Login e Cadastro
│   ├── products/        # Listagem e Detalhes
│   ├── cart/            # Carrinho de Compras
│   ├── checkout/        # Finalização de Compra
│   ├── orders/          # Pedidos do Usuário
│   └── admin/           # Painel Administrativo
└── layout/
    ├── main-layout/     # Layout principal
    ├── auth-layout/     # Layout de autenticação
    └── admin-layout/    # Layout admin com sidenav
```

## Rotas da API Consumidas

### Autenticação (/api/auth)
- POST /api/auth/register — Registrar novo usuário
- POST /api/auth/login — Login e obtenção do JWT

### Produtos (/api/products)
- GET  /api/products — Listar todos (paginado)
- GET  /api/products/{id} — Buscar por ID
- GET  /api/products/category/{category} — Filtrar por categoria
- GET  /api/products/search?name=... — Buscar por nome
- POST /api/products — Criar produto (Admin)
- PUT  /api/products/{id} — Atualizar produto (Admin)
- DELETE /api/products/{id} — Excluir produto (Admin)

### Carrinho (/api/cart)
- GET    /api/cart — Obter carrinho
- POST   /api/cart/items — Adicionar item
- PUT    /api/cart/items/{itemId}?quantity=N — Atualizar quantidade
- DELETE /api/cart/items/{itemId} — Remover item
- DELETE /api/cart — Limpar carrinho

### Pedidos (/api/orders)
- POST /api/orders — Criar pedido
- GET  /api/orders — Listar pedidos do usuário
- GET  /api/orders/{orderId} — Detalhes do pedido
- PUT  /api/orders/{orderId}/status?status=... — Atualizar status (Admin)

### Pagamentos (/api/payments)
- GET  /api/payments/{paymentId} — Detalhes do pagamento
- POST /api/payments/{paymentId}/refund — Reembolsar (Admin)

## Configuração de CORS no Backend

Certifique-se de que o backend Java está configurado com CORS habilitado para http://localhost:4200.

## Design System

- Paleta primária: Azul (#1565c0)
- Paleta de destaque: Laranja (#e65100)
- Tipografia: Inter (Google Fonts)
- Componentes: Angular Material com customizações SCSS
- Responsivo: Layout adaptável para mobile, tablet e desktop
