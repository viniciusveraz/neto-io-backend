import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from '../utils/openapi-spec';

const docsRoutes = Router();

// Endpoint que entrega o Swagger UI interativo
docsRoutes.use('/', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
  customSiteTitle: 'neto.io API - Documentação Interativa',
  customCss: '.swagger-ui .topbar { display: block; background-color: #0d9488; }',
}));

// Rota para exportação do esquema JSON OpenAPI
docsRoutes.get('/json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(openApiSpec);
});

export { docsRoutes };
