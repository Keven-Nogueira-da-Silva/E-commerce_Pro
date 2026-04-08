<img width="2560" height="1399" alt="image" src="https://github.com/user-attachments/assets/6a5b3219-9505-4d6a-a70e-c9fec4d6375c" />
ShopAngular — Frontend Angular para E-commerce

Projeto Angular 17 profissional que consome todas as rotas da API REST de e-commerce em Java (Spring Boot + JWT).

Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
| --- | --- | --- |
| Angular | 17 | Framework principal (Standalone Components) |
| Angular Material | 17 | Biblioteca de componentes UI |
| TypeScript | 5.x | Linguagem principal |
| SCSS | — | Estilização customizada |
| RxJS | 7.x | Programação reativa |
| Inter (Google Fonts) | — | Tipografia profissional |



Pré-requisitos

Node.js >= 18

pnpm >= 8 (ou npm/yarn)

Angular CLI >= 17

Backend Java rodando em http://localhost:8080


Instalação e Execução

# 1. Instalar dependências
pnpm install

# 2. Configurar URL da API (se necessário  )
# Edite: src/environments/environment.ts
# Altere: apiUrl: 'http://localhost:8080/api'

# 3. Iniciar servidor de desenvolvimento
pnpm start

# Acesse: http://localhost:4200

Build para Produção
pnpm build
# Arquivos gerados em: dist/ecommerce-frontend/

Estrutura do Projeto
src/app/
├── core/
│   ├── models/          # Interfaces TypeScript (DTOs  )
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

# 🛒 E-Commerce Backend API

API REST completa para plataforma de e-commerce com autenticação JWT, gerenciamento de carrinho, processamento de pedidos e integração com meios de pagamento.

Rotas da API Consumidas

Autenticação (/api/auth)
POST /api/auth/register — Registrar novo usuário
POST /api/auth/login — Login e obtenção do JWT

Produtos (/api/products)
GET /api/products — Listar todos (paginado)
GET /api/products/{id} — Buscar por ID
GET /api/products/category/{category} — Filtrar por categoria
GET /api/products/search?name=... — Buscar por nome
POST /api/products — Criar produto (Admin)
PUT /api/products/{id} — Atualizar produto (Admin)
DELETE /api/products/{id} — Excluir produto (Admin)

Carrinho (/api/cart)
GET /api/cart — Obter carrinho
POST /api/cart/items — Adicionar item
PUT /api/cart/items/{itemId}?quantity=N — Atualizar quantidade
DELETE /api/cart/items/{itemId} — Remover item
DELETE /api/cart — Limpar carrinho

Pedidos (/api/orders)
POST /api/orders — Criar pedido
GET /api/orders — Listar pedidos do usuário
GET /api/orders/{orderId} — Detalhes do pedido
PUT /api/orders/{orderId}/status?status=... — Atualizar status (Admin)

Pagamentos (/api/payments)
GET /api/payments/{paymentId} — Detalhes do pagamento
POST /api/payments/{paymentId}/refund — Reembolsar (Admin)

Configuração de CORS no Backend
Certifique-se de que o backend Java está configurado com CORS habilitado para http://localhost:4200.
Design System

Paleta primária: Azul (#1565c0 )
Paleta de destaque: Laranja (#e65100)

Tipografia: Inter (Google Fonts)


Componentes: Angular Material com customizações SCSS
Responsivo: Layout adaptável para mobile, tablet e desktop



## 📋 Índice

- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Executando a Aplicação](#executando-a-aplicação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Documentação da API](#documentação-da-api)
- [Endpoints](#endpoints)
- [Modelos de Dados](#modelos-de-dados)
- [Códigos de Status HTTP](#códigos-de-status-http)
- [Tratamento de Erros](#tratamento-de-erros)
- [Segurança](#segurança)
- [Testando a API](#testando-a-api)
- [Deploy](#deploy)
- [Solução de Problemas](#solução-de-problemas)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🚀 Tecnologias

- **Java 17** - Linguagem de programação
- **Spring Boot 3.1.5** - Framework principal
- **Spring Security** - Autenticação e autorização
- **Spring Data JPA** - Persistência de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT (JSON Web Token)** - Autenticação stateless
- **Maven** - Gerenciador de dependências
- **Swagger/OpenAPI** - Documentação interativa
- **Docker** - Containerização
- **Lombok** - Redução de boilerplate

## ✨ Funcionalidades

### 🔐 Autenticação e Autorização
- Registro de usuários
- Login com JWT
- Roles: ADMIN e USER
- Proteção de rotas por role
- Token expiration (24 horas)

### 📦 Produtos
- CRUD completo de produtos
- Listagem paginada
- Filtro por categoria
- Busca por nome
- Controle de estoque

### 🛒 Carrinho de Compras
- Adicionar/remover produtos
- Atualizar quantidades
- Cálculo automático de subtotais
- Persistência por usuário

### 📝 Pedidos
- Criação de pedidos a partir do carrinho
- Histórico de pedidos por usuário
- Atualização de status (Admin)
- Números de pedido únicos

### 💳 Pagamentos
- Suporte a múltiplos métodos:
  - Cartão de Crédito
  - Cartão de Débito
  - PIX
  - Boleto Bancário
- Status de pagamento (PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED)
- Simulação de processamento

### 📚 Documentação
- Swagger UI interativa
- OpenAPI 3.0
- Exemplos de requisição/resposta

## 📋 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:

- [Java 17+](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [Maven 3.8+](https://maven.apache.org/download.cgi)
- [PostgreSQL 14+](https://www.postgresql.org/download/)
- [Docker](https://www.docker.com/products/docker-desktop/) (opcional)
- [Git](https://git-scm.com/)

## 🔧 Instalação e Configuração

<img width="2560" height="1399" alt="image" src="https://github.com/user-attachments/assets/0e4063c8-4d1b-46aa-b067-a17adffab1b6" />


### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/ecommerce-backend.git
cd ecommerce-backend


2. Configurar o banco de dados
Opção A: Usando Docker (Recomendado)

docker run --name ecommerce-postgres \
  -e POSTGRES_DB=ecommerce_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

3. Configurar variáveis de ambiente
Crie um arquivo .env na raiz do projeto:
# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USERNAME=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000

# Servidor
SERVER_PORT=8080

4. Build do projeto
# Limpar e compilar
mvn clean package

# Pular testes
mvn clean package -DskipTests

5. Executar a aplicação
mvn spring-boot:run

application.yml
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:ecommerce_db}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:password}
  
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
    show-sql: false

app:
  jwt:
    secret: ${JWT_SECRET:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}
    expiration: ${JWT_EXPIRATION:86400000}

server:
  port: ${SERVER_PORT:8080}



📁 Estrutura do Projeto
ecommerce-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/ecommerce/
│   │   │       ├── config/
│   │   │       │   ├── SecurityConfig.java
│   │   │       │   ├── JwtAuthenticationFilter.java
│   │   │       │   ├── JwtService.java
│   │   │       │   └── SwaggerConfig.java
│   │   │       ├── controller/
│   │   │       │   ├── AuthController.java
│   │   │       │   ├── ProductController.java
│   │   │       │   ├── CartController.java
│   │   │       │   ├── OrderController.java
│   │   │       │   └── PaymentController.java
│   │   │       ├── dto/
│   │   │       │   ├── request/
│   │   │       │   └── response/
│   │   │       ├── model/
│   │   │       │   ├── User.java
│   │   │       │   ├── Product.java
│   │   │       │   ├── Cart.java
│   │   │       │   ├── CartItem.java
│   │   │       │   ├── Order.java
│   │   │       │   ├── OrderItem.java
│   │   │       │   └── Payment.java
│   │   │       ├── repository/
│   │   │       ├── service/
│   │   │       └── exception/
│   │   └── resources/
│   │       └── application.yml
│   └── test/
└── pom.xml
