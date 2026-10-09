import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/app-error';
import { AuthUserPayload } from '../@types/express';

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export function ensureAuthenticated(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token de autenticação não fornecido.', 401);
  }

  const [scheme, token] = authHeader.split(' ');

  if (!scheme || !token || !/^Bearer$/i.test(scheme)) {
    throw new AppError('Formato de token inválido. Utilize "Bearer <token>".', 401);
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as TokenPayload;

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    return next();
  } catch {
    throw new AppError('Token de autenticação inválido ou expirado.', 401);
  }
}

export function ensureAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    throw new AppError('Usuário não autenticado.', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Acesso negado. Recurso restrito a administradores.', 403);
  }

  return next();
}
