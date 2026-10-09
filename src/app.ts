import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';
import { routes } from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { apiRateLimiter } from './middlewares/rate-limit.middleware';
import { AppError } from './utils/app-error';

const app = express();

// Configuração de CORS (TASK-UI-02)
app.use(
  cors({
    origin: env.corsOrigin === '*' ? '*' : env.corsOrigin.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Limitação global de taxa de requisições (TASK-UI-08)
app.use(apiRateLimiter);

// Parsers de payload JSON e URL-Encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servidor de arquivos estáticos para imagens enviadas no upload (TASK-UI-05)
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Montagem de todas as rotas da API
app.use(routes);

// Tratamento para rotas inexistentes (404)
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`A rota ${req.method} ${req.originalUrl} não foi encontrada no servidor neto.io.`, 404));
});

// Middleware centralizado de tratamento de erros HTTP (TASK-API-07)
app.use(errorHandler);

export { app };
