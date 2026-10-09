export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'neto.io API - Guia Turístico do Litoral do Piauí & Monitoramento de Vento',
    version: '1.0.0',
    description: `
API RESTful completa do ecossistema **neto.io**.
Fornece catálogo turístico dos municípios costeiros do Piauí (**Parnaíba, Luís Correia, Barra Grande / Cajueiro da Praia e Ilha Grande**), avaliações de viajantes e telemetria em tempo real das condições e velocidade do vento em **Barra Grande (BG)** para a prática de Kitesurf.

---
### Autenticação
As rotas protegidas utilizam cabeçalho padrão HTTP:
\`Authorization: Bearer <seu_token_jwt>\`
    `,
    contact: {
      name: 'Equipe de Engenharia neto.io',
      email: 'contato@neto.io',
    },
  },
  servers: [
    {
      url: 'http://localhost:3333',
      description: 'Servidor Local de Desenvolvimento',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o token JWT gerado no endpoint /auth/login ou /auth/register',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cm81ab23c4d5e' },
          name: { type: 'string', example: 'Lucas Kiteboarding' },
          email: { type: 'string', format: 'email', example: 'lucas@kitesurf.com' },
          role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'USER' },
          avatarUrl: { type: 'string', format: 'uri', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string', example: 'Kitesurf & Esportes Náuticos' },
          slug: { type: 'string', example: 'kitesurf' },
          description: { type: 'string' },
          icon: { type: 'string', example: 'wind' },
          spotsCount: { type: 'integer', example: 5 },
        },
      },
      TouristSpot: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string', example: 'Praia de Barra Grande' },
          slug: { type: 'string', example: 'praia-de-barra-grande' },
          description: { type: 'string' },
          city: { type: 'string', example: 'Barra Grande' },
          address: { type: 'string', nullable: true },
          latitude: { type: 'number', example: -2.9189 },
          longitude: { type: 'number', example: -41.4058 },
          imageUrl: { type: 'string' },
          isFeatured: { type: 'boolean', example: true },
          kitesurfSpot: { type: 'boolean', example: true },
          contactPhone: { type: 'string', nullable: true },
          instagram: { type: 'string', nullable: true },
          averageRating: { type: 'number', example: 5.0, nullable: true },
          totalReviews: { type: 'integer', example: 12 },
        },
      },
      Review: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
          comment: { type: 'string', example: 'Ventos perfeitos de 22 nós!' },
          createdAt: { type: 'string', format: 'date-time' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              avatarUrl: { type: 'string', nullable: true },
            },
          },
        },
      },
      LiveWeather: {
        type: 'object',
        properties: {
          location: {
            type: 'object',
            properties: {
              spot: { type: 'string', example: 'Barra Grande' },
              city: { type: 'string', example: 'Cajueiro da Praia' },
              state: { type: 'string', example: 'Piauí' },
            },
          },
          updatedAt: { type: 'string', example: '2026-10-09T18:00' },
          temperatureC: { type: 'number', example: 29.5 },
          humidityPercent: { type: 'number', example: 68 },
          wind: {
            type: 'object',
            properties: {
              speedKmh: { type: 'number', example: 42.5 },
              speedKnots: { type: 'number', example: 22.9 },
              gustsKmh: { type: 'number', example: 48.0 },
              gustsKnots: { type: 'number', example: 25.9 },
              directionDegrees: { type: 'number', example: 75 },
              cardinal: {
                type: 'object',
                properties: {
                  code: { type: 'string', example: 'ENE' },
                  label: { type: 'string', example: 'Leste-Nordeste' },
                },
              },
            },
          },
          kitesurf: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'EXCELLENT' },
              badge: { type: 'string', example: 'Condições Perfeitas 🚀' },
              recommendedKiteSize: { type: 'string', example: '7m - 9m' },
              advice: { type: 'string', example: 'Vento constante e seguro (ENE Side-Onshore).' },
            },
          },
        },
      },
    },
  },
  paths: {
    '/home': {
      get: {
        tags: ['Homepage'],
        summary: 'Payload agregado para carregamento instantâneo da Homepage (TASK-UI-01)',
        description: 'Retorna simultaneamente o vento em Barra Grande, pontos turísticos em destaque, lista de categorias e cidades.',
        responses: {
          200: {
            description: 'Dados agregados da home retornados com sucesso.',
          },
        },
      },
    },
    '/weather/barra-grande': {
      get: {
        tags: ['Clima & Vento'],
        summary: 'Velocidade e direção do vento em tempo real em Barra Grande (BG) (TASK-API-05)',
        description: 'Consulta a API Open-Meteo para retornar vento em km/h, nós náuticos, direção em graus e cardeal, além de recomendação do tamanho do kite.',
        responses: {
          200: {
            description: 'Condições do vento retornadas com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/LiveWeather' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/weather/barra-grande/history': {
      get: {
        tags: ['Clima & Vento'],
        summary: 'Histórico recente e previsão horária de vento em Barra Grande (TASK-UI-06)',
        description: 'Fornece série temporal de vento (últimas 12h + próximas 24h) com média e pico de vento para gráficos no front-end.',
        responses: {
          200: {
            description: 'Histórico e previsão horária retornados.',
          },
        },
      },
    },
    '/spots': {
      get: {
        tags: ['Pontos Turísticos'],
        summary: 'Listagem de pontos turísticos com filtros e paginação (TASK-API-04, 06, UI-03)',
        parameters: [
          { name: 'city', in: 'query', schema: { type: 'string' }, description: 'Filtrar por cidade (ex: Barra Grande, Luís Correia, Parnaíba, Ilha Grande)' },
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filtrar por slug ou ID de categoria (ex: kitesurf, praias)' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Busca por texto no nome, descrição ou cidade' },
          { name: 'kitesurfOnly', in: 'query', schema: { type: 'boolean' }, description: 'Filtrar apenas picos com prática de Kitesurf' },
          { name: 'featuredOnly', in: 'query', schema: { type: 'boolean' }, description: 'Filtrar apenas locais em destaque' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Número da página' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 }, description: 'Registros por página' },
        ],
        responses: {
          200: {
            description: 'Lista paginada de pontos turísticos retornada.',
          },
        },
      },
      post: {
        tags: ['Pontos Turísticos'],
        summary: 'Cadastrar novo ponto turístico (TASK-API-04)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'description', 'city', 'categoryId'],
                properties: {
                  name: { type: 'string', example: 'Praia do Coqueiro' },
                  description: { type: 'string', example: 'Recifes naturais e barracas' },
                  city: { type: 'string', example: 'Luís Correia' },
                  categoryId: { type: 'string', example: 'cm81...' },
                  latitude: { type: 'number', example: -2.8943 },
                  longitude: { type: 'number', example: -41.5645 },
                  imageUrl: { type: 'string', example: 'https://images.unsplash.com/...' },
                  kitesurfSpot: { type: 'boolean', example: false },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Ponto turístico criado com sucesso.' },
          401: { description: 'Token de autenticação ausente ou inválido.' },
        },
      },
    },
    '/spots/{id}': {
      get: {
        tags: ['Pontos Turísticos'],
        summary: 'Obter detalhes de um ponto turístico por ID ou slug',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID ou slug do local' },
        ],
        responses: {
          200: { description: 'Detalhes do ponto turístico retornados.' },
          404: { description: 'Ponto turístico não encontrado.' },
        },
      },
      put: {
        tags: ['Pontos Turísticos'],
        summary: 'Atualizar ponto turístico existente (TASK-API-04)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  city: { type: 'string' },
                  imageUrl: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Ponto turístico atualizado com sucesso.' },
        },
      },
      delete: {
        tags: ['Pontos Turísticos'],
        summary: 'Excluir ponto turístico (Restrito a ADMIN) (TASK-API-04)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Ponto turístico removido com sucesso.' },
          403: { description: 'Acesso negado. Requer papel ADMIN.' },
        },
      },
    },
    '/spots/{id}/reviews': {
      get: {
        tags: ['Avaliações'],
        summary: 'Listar avaliações de um ponto turístico (TASK-UI-04)',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Avaliações do local retornadas.' },
        },
      },
      post: {
        tags: ['Avaliações'],
        summary: 'Publicar avaliação com nota e comentário (TASK-UI-04)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['rating', 'comment'],
                properties: {
                  rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
                  comment: { type: 'string', example: 'Lugar maravilhoso, água morna e visual paradisíaco!' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Avaliação cadastrada com sucesso.' },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Autenticação'],
        summary: 'Cadastro de novo usuário (TASK-API-03)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Pedro Velejador' },
                  email: { type: 'string', example: 'pedro@kitesurf.com' },
                  password: { type: 'string', example: 'senhaForte123' },
                  avatarUrl: { type: 'string', example: 'https://images.unsplash.com/...' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Usuário registrado com sucesso.' },
          409: { description: 'E-mail já cadastrado.' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Autenticação'],
        summary: 'Login com e-mail e senha (TASK-API-03)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@neto.io' },
                  password: { type: 'string', example: 'neto123456' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login autenticado com sucesso e retorno do token JWT.' },
          401: { description: 'Credenciais inválidas.' },
        },
      },
    },
    '/me': {
      get: {
        tags: ['Autenticação'],
        summary: 'Obter dados do perfil do usuário autenticado (TASK-UI-07)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Dados do perfil do usuário.' },
          401: { description: 'Não autenticado.' },
        },
      },
    },
    '/categories': {
      get: {
        tags: ['Categorias'],
        summary: 'Listar todas as categorias com contagem de locais associados',
        responses: {
          200: { description: 'Lista de categorias retornada.' },
        },
      },
    },
    '/upload': {
      post: {
        tags: ['Upload de Arquivos'],
        summary: 'Upload de foto de ponto turístico (TASK-UI-05)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Arquivo de imagem (JPEG, PNG, WEBP, GIF, máx. 5MB)',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Imagem enviada com sucesso e URL pública gerada.' },
        },
      },
    },
  },
};
