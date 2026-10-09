import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { weatherRoutes } from './weather.routes';
import { touristSpotRoutes } from './tourist-spot.routes';
import { categoryRoutes } from './category.routes';
import { homeRoutes } from './home.routes';
import { uploadRoutes } from './upload.routes';
import { docsRoutes } from './docs.routes';
import { AuthController } from '../controllers/auth.controller';
import { ensureAuthenticated } from '../middlewares/auth.middleware';

const routes = Router();
const authController = new AuthController();

// Status e Informações da API
routes.get('/', (_req, res) => {
  res.json({
    name: 'neto.io API',
    description: 'Guia turístico digital do Litoral do Piauí e Telemetria de Vento em Barra Grande',
    version: '1.0.0',
    documentation: '/docs',
    endpoints: {
      home: '/home',
      weatherBarraGrande: '/weather/barra-grande',
      weatherBarraGrandeHistory: '/weather/barra-grande/history',
      touristSpots: '/spots',
      categories: '/categories',
      authRegister: '/auth/register',
      authLogin: '/auth/login',
      currentUser: '/me',
      upload: '/upload',
    },
  });
});

// Health check para monitoramento
routes.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mapeamento dos módulos de rotas
routes.use('/auth', authRoutes);
routes.use('/weather', weatherRoutes);
routes.use('/spots', touristSpotRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/home', homeRoutes);
routes.use('/upload', uploadRoutes);
routes.use('/docs', docsRoutes);

// Alias direto para GET /me (TASK-UI-07)
routes.get('/me', ensureAuthenticated, authController.getMe);

export { routes };
