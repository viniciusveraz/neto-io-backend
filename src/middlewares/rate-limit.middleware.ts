import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const apiRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true, // Retorna cabeçalhos 'RateLimit-*' conforme RFC
  legacyHeaders: false, // Desabilita 'X-RateLimit-*'
  message: {
    status: 'error',
    message: 'Muitas requisições originadas deste endereço IP. Por favor, aguarde alguns minutos antes de tentar novamente.',
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // Limite mais restritivo para rotas de login/registro (proteção contra brute force)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Muitas tentativas de autenticação. Por favor, aguarde 15 minutos antes de tentar novamente.',
  },
});
