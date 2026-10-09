# 🌴 neto.io - Back-end (API RESTful)

> **Guia turístico digital focado no litoral do Piauí** (Parnaíba, Luís Correia, Barra Grande / Cajueiro da Praia e Ilha Grande) com **telemetria em tempo real da velocidade e direção do vento em Barra Grande (BG)** para praticantes de Kitesurf e velejadores da Rota das Emoções.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-indigo.svg)](https://www.prisma.io/)
[![Swagger](https://img.shields.io/badge/OpenAPI-Swagger-85EA2D.svg)](http://localhost:3333/docs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 Sumário
- [1. Visão Geral](#1-visão-geral)
- [2. Tecnologias Utilizadas (Artefato 1)](#2-tecnologias-utilizadas-artefato-1)
- [3. Arquitetura e Estrutura de Pastas](#3-arquitetura-e-estrutura-de-pastas)
- [4. Configuração do Ambiente e Instalação](#4-configuração-do-ambiente-e-instalação)
- [5. Execução do Projeto](#5-execução-do-projeto)
- [6. Documentação Interativa da API (Swagger)](#6-documentação-interativa-da-api-swagger)
- [7. Mapeamento de Rotas da API](#7-mapeamento-de-rotas-da-api)
- [8. Integração de Vento e Clima em Barra Grande (Open-Meteo)](#8-integração-de-vento-e-clima-em-barra-grande-open-meteo)
- [9. Padrão de Versionamento (Conventional Commits)](#9-padrão-de-versionamento-conventional-commits)
- [10. Mapeamento de Tarefas e Sprints no Trello](#10-mapeamento-de-tarefas-e-sprints-no-trello)

---

## 1. Visão Geral

O **neto.io** foi concebido para suprir uma necessidade latente dos turistas e velejadores do litoral piauiense: reunir em um único ecossistema digital o catálogo de atrativos turísticos (praias paradisíacas, gastronomia regional, ecoturismo no Delta do Parnaíba e pousadas de charme) combinado com uma **central meteorológica inteligente com foco nos ventos alísios de Barra Grande**, considerado um dos melhores picos de Kitesurf do planeta.

---

## 2. Tecnologias Utilizadas (Artefato 1)

| Camada | Tecnologia | Justificativa Técnica |
| :--- | :--- | :--- |
| **Runtime & Linguagem** | **Node.js (v20+) com TypeScript** | Segurança de tipos em tempo de compilação, autocompletion e manutenibilidade em larga escala. |
| **Framework Web** | **Express.js** | Ecossistema maduro, alta flexibilidade para middlewares, facilidade de integração com Swagger e Multer. |
| **Banco de Dados** | **PostgreSQL / SQLite** | Relacionamentos consistentes com integridade referencial para Usuários, Pontos Turísticos, Categorias e Avaliações. SQLite pronto para desenvolvimento imediato e PostgreSQL para produção. |
| **ORM** | **Prisma ORM** | Migrations tipadas, cliente declarativo (`PrismaClient`), prevenção nativa de SQL Injection e alto desempenho. |
| **Integração de Clima** | **Axios + Open-Meteo API** | Consumo dos ventos em Barra Grande (latitude `-2.9189`, longitude `-41.4058`) sem necessidade de chaves pagas, com dados de velocidade, rajadas e ângulo do vento. |
| **Autenticação** | **JWT (JSON Web Token) + Bcryptjs** | Padrão stateless de autenticação com salt rounds seguros (10) para armazenamento de senhas. |
| **Validação de Dados** | **Zod** | Schemas estritos para validação de requisições (`body`, `query`, `params`) com mensagens de erro em português. |
| **Segurança e Otimização** | **CORS & Express Rate Limit** | Políticas de origem controladas e prevenção contra abusos e ataques de força bruta. |
| **Upload de Mídia** | **Multer** | Processamento de imagens multipart/form-data com restrição de tipos MIME (JPEG/PNG/WEBP) e tamanho (máx. 5MB). |
| **Documentação** | **Swagger UI Express (OpenAPI 3.0)** | Interface visual navegável disponível na rota `/docs`. |

---

## 3. Arquitetura e Estrutura de Pastas

```text
neto-io-backend/
├── prisma/
│   ├── schema.prisma            # Modelos relacionais (User, TouristSpot, Category, Review)
│   └── seed.ts                  # Carga inicial com pontos turísticos do Piauí e usuários
├── src/
│   ├── @types/
│   │   └── express.d.ts         # Extensão dos tipos do Express (req.user)
│   ├── config/
│   │   ├── env.ts               # Validação e centralização de variáveis de ambiente
│   │   └── prisma.ts            # Instância singleton do PrismaClient
│   ├── controllers/
│   │   ├── auth.controller.ts   # Controladores de cadastro, login e perfil
│   │   ├── category.controller.ts # Listagem e cadastro de categorias
│   │   ├── home.controller.ts   # Agregação do payload da tela inicial
│   │   ├── review.controller.ts # Criação e leitura de avaliações
│   │   ├── tourist-spot.controller.ts # CRUD, buscas e filtros de pontos turísticos
│   │   ├── upload.controller.ts # Upload de fotos com Multer
│   │   └── weather.controller.ts# Endpoints de vento e previsão de Barra Grande
│   ├── middlewares/
│   │   ├── auth.middleware.ts   # Autenticação JWT e proteção de rotas admin
│   │   ├── error.middleware.ts  # Tratamento global de erros HTTP e Prisma
│   │   ├── rate-limit.middleware.ts # Limitação de taxa de requisições por IP
│   │   └── validate.middleware.ts   # Validação de schema com Zod
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── category.routes.ts
│   │   ├── docs.routes.ts
│   │   ├── home.routes.ts
│   │   ├── index.ts             # Roteador central da aplicação
│   │   ├── tourist-spot.routes.ts
│   │   ├── upload.routes.ts
│   │   └── weather.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── category.service.ts
│   │   ├── home.service.ts
│   │   ├── review.service.ts
│   │   ├── tourist-spot.service.ts
│   │   └── weather.service.ts
│   ├── utils/
│   │   ├── app-error.ts         # Classe de erro operacional padronizada
│   │   ├── openapi-spec.ts      # Especificação completa OpenAPI 3.0
│   │   └── wind-calculator.ts   # Utilitários de conversão km/h -> nós, cardeais e kitesurf
│   ├── app.ts                   # Configuração dos middlewares Express
│   └── server.ts                # Inicialização do servidor HTTP
├── uploads/                     # Diretório de persistência de arquivos enviados
├── .env.example                 # Exemplo de configuração de variáveis de ambiente
├── .gitignore                   # Exclusão de node_modules, build e dados locais
├── package.json                 # Dependências e scripts npm
├── README.md                    # Documentação técnica completa
└── tsconfig.json                # Configurações do compilador TypeScript
```

---

## 4. Configuração do Ambiente e Instalação

### Pré-requisitos
- **Node.js**: versão 20.x ou superior instalada
- **npm** (ou yarn / pnpm)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/viniciusveraz/neto-io-backend.git
   cd neto-io-backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
   *No Windows PowerShell:*
   ```powershell
   Copy-Item .env.example .env
   ```

   As variáveis padrão já vêm configuradas para execução imediata:
   ```env
   PORT=3333
   NODE_ENV=development
   API_BASE_URL=http://localhost:3333
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="neto_io_secret_jwt_key_piaui_litoral_2026"
   JWT_EXPIRES_IN="7d"
   CORS_ORIGIN="*"
   OPEN_METEO_BASE_URL="https://api.open-meteo.com/v1"
   ```

4. **Prepare o Banco de Dados e execute o Seed:**
   ```bash
   # Sincroniza as tabelas no banco de dados SQLite/PostgreSQL
   npx prisma db push

   # Popula o banco com pontos turísticos do Piauí, categorias e usuários de teste
   npm run prisma:seed
   ```

---

## 5. Execução do Projeto

### Modo de Desenvolvimento (Hot Reload)
```bash
npm run dev
```
O servidor estará ativo em `http://localhost:3333`.

### Compilação e Produção
```bash
# Compila o TypeScript para a pasta dist/
npm run build

# Inicia o servidor em modo produção
npm run start
```

### Prisma Studio (Interface Visual do Banco de Dados)
```bash
npm run prisma:studio
```
Acesse `http://localhost:5555` para visualizar e editar os dados cadastrados diretamente no navegador.

---

## 6. Documentação Interativa da API (Swagger)

A API possui documentação interativa completa gerada no padrão **OpenAPI 3.0**. Você pode testar todos os endpoints diretamente no navegador:

👉 **URL da Documentação:** [http://localhost:3333/docs](http://localhost:3333/docs)

Para exportar o esquema JSON OpenAPI:
👉 **URL do Esquema JSON:** [http://localhost:3333/docs/json](http://localhost:3333/docs/json)

---

## 7. Mapeamento de Rotas da API

### 🧭 7.1 Homepage Otimizada (TASK-UI-01)
- `GET /home` - Retorna em um único payload ultrarrápido os dados de telemetria de vento em Barra Grande, pontos turísticos em destaque, lista de categorias e resumo por municípios.

### 💨 7.2 Clima e Vento em Barra Grande (TASK-API-05 & TASK-UI-06)
- `GET /weather/barra-grande` - Vento em tempo real (km/h, nós náuticos, rajadas, ângulo, direção cardeal e análise técnica de kitesurf: tamanho recomendado de pipa e status de segurança).
- `GET /weather/barra-grande/history` - Histórico das últimas 12 horas e previsão para as próximas 24 horas, com cálculo de pico (max knots), média e melhor horário de velejo para geração de gráficos no front-end.

### 🏖️ 7.3 Pontos Turísticos do Litoral (TASK-API-04, TASK-API-06, TASK-UI-03)
- `GET /spots` - Listagem paginada com suporte a filtros:
  - `?city=Barra+Grande` (Filtra por município: Barra Grande, Luís Correia, Parnaíba, Ilha Grande)
  - `?category=kitesurf` (Filtra por slug ou ID de categoria)
  - `?search=macapa` (Busca textual no título, descrição ou cidade)
  - `?kitesurfOnly=true` (Filtra apenas picos adequados para velejo)
  - `?page=1&limit=10` (Paginação de alto desempenho)
- `GET /spots/:id` - Detalhes completos do local (por ID ou slug amigável) incluindo média de avaliações.
- `POST /spots` - Cadastrar novo ponto turístico *(Requer Token JWT)*.
- `PUT /spots/:id` - Atualizar dados do local *(Requer Token JWT)*.
- `DELETE /spots/:id` - Remover ponto turístico *(Restrito a ADMIN)*.

### ⭐ 7.4 Avaliações e Comentários (TASK-UI-04)
- `GET /spots/:id/reviews` - Lista avaliações de viajantes e kiters para o ponto turístico informado.
- `POST /spots/:id/reviews` - Envia avaliação com nota de 1 a 5 estrelas e comentário *(Requer Token JWT)*.

### 🔐 7.5 Autenticação de Usuários (TASK-API-03 & TASK-UI-07)
- `POST /auth/register` - Cadastro de novos usuários com hash de senha via Bcrypt.
- `POST /auth/login` - Autenticação por e-mail e senha com geração de Token JWT.
- `GET /me` (ou `/auth/me`) - Retorna o perfil completo do usuário autenticado *(Requer Token JWT)*.

### 🏷️ 7.6 Categorias
- `GET /categories` - Lista categorias cadastradas com quantidade de locais vinculados.
- `GET /categories/:slug` - Detalha a categoria e retorna seus locais.
- `POST /categories` - Cria nova categoria *(Restrito a ADMIN)*.

### 📸 7.7 Upload de Fotos (TASK-UI-05)
- `POST /upload` - Envio de imagem multipart/form-data (campo `file`). Retorna a URL pública permanente para uso na galeria do ponto turístico *(Requer Token JWT)*.

---

## 8. Integração de Vento e Clima em Barra Grande (Open-Meteo)

Barra Grande (Cajueiro da Praia - PI) é internacionalmente reconhecida pela constância dos seus ventos alísios (direção Leste / ENE side-onshore).

A API realiza o consumo da Open-Meteo nas coordenadas:
- **Latitude:** `-2.9189`
- **Longitude:** `-41.4058`

### Exemplo de Resposta de Telemetria (`GET /weather/barra-grande`):
```json
{
  "status": "success",
  "data": {
    "location": {
      "spot": "Barra Grande",
      "city": "Cajueiro da Praia",
      "state": "Piauí",
      "latitude": -2.9189,
      "longitude": -41.4058
    },
    "updatedAt": "2026-10-09T19:15",
    "temperatureC": 27.2,
    "humidityPercent": 85,
    "wind": {
      "speedKmh": 32.6,
      "speedKnots": 17.6,
      "gustsKmh": 56.2,
      "gustsKnots": 30.3,
      "directionDegrees": 67,
      "cardinal": {
        "code": "ENE",
        "label": "Leste-Nordeste"
      }
    },
    "kitesurf": {
      "status": "GOOD",
      "badge": "Muito Bom 🪁",
      "recommendedKiteSize": "9m - 12m",
      "advice": "Vento clássico de Barra Grande. Excelente para velejadores de todos os níveis."
    }
  }
}
```

---

## 9. Padrão de Versionamento (Conventional Commits)

O projeto adota a convenção **Conventional Commits 1.0.0** para padronização das mensagens do Git:

| Prefixo | Significado | Exemplo |
| :--- | :--- | :--- |
| `feat:` | Nova funcionalidade ou endpoint implementado | `feat(weather): adiciona integracao com Open-Meteo para Barra Grande` |
| `fix:` | Correção de bug ou falha de comportamento | `fix(auth): corrige validacao de expiracao do token jwt` |
| `docs:` | Atualização ou adição de documentações | `docs: documenta endpoints no swagger e adiciona instrucoes no README` |
| `chore:` | Tarefas de manutenção de build, dependências ou configs | `chore: adiciona configuracao inicial do prisma e tsconfig` |
| `refactor:` | Refatoração de código sem alterar o comportamento público | `refactor(spots): otimiza calculo de media de avaliacoes` |
| `test:` | Adição ou modificação de testes automatizados | `test(weather): adiciona teste unitario para conversao de nos e cardeal` |

---

## 10. Mapeamento de Tarefas e Sprints no Trello

### 📊 Sprints de Back-end / API (Entregues)
1. ✅ **[TASK-API-01]** Configuração Inicial do Projeto e Prisma ORM
2. ✅ **[TASK-API-02]** Criação dos Modelos de Dados (User, TouristSpot, Category, Review)
3. ✅ **[TASK-API-03]** Serviço de Autenticação de Usuários (Bcrypt + JWT)
4. ✅ **[TASK-API-04]** CRUD de Pontos Turísticos do Litoral
5. ✅ **[TASK-API-05]** Integração de Clima e Vento para Barra Grande (BG)
6. ✅ **[TASK-API-06]** Filtros e Busca de Locais por Categoria/Cidade
7. ✅ **[TASK-API-07]** Middlewares de Validação (Zod) e Tratamento Global de Erros
8. ✅ **[TASK-API-08]** Documentação da API com Swagger na rota `/docs`

### 💻 Sprints de Suporte à UI / Integração (Entregues)
1. ✅ **[TASK-UI-01]** Especificação e Mock do Payload da Homepage (`GET /home`)
2. ✅ **[TASK-UI-02]** Configuração do CORS e Políticas de Origem
3. ✅ **[TASK-UI-03]** Endpoint de Paginação para Listagem de Pontos Turísticos
4. ✅ **[TASK-UI-04]** Endpoint de Avaliações e Comentários (`GET/POST /spots/:id/reviews`)
5. ✅ **[TASK-UI-05]** Serviço de Upload / Armazenamento de Imagens (`POST /upload`)
6. ✅ **[TASK-UI-06]** Endpoint de Estatísticas / Dashboard do Vento (`GET /weather/barra-grande/history`)
7. ✅ **[TASK-UI-07]** Endpoint de Perfil do Usuário (`GET /me`)
8. ✅ **[TASK-UI-08]** Implementação de Rate Limiting e Otimização contra abusos

---

## 👤 Usuários de Teste Pré-Cadastrados (Seed)

| Usuário | E-mail | Senha | Papel |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@neto.io` | `neto123456` | ADMIN |
| **Velejador (Kiter)** | `lucas@kitesurf.com` | `neto123456` | USER |
| **Viajante Turista** | `marina@viagens.com.br` | `neto123456` | USER |
