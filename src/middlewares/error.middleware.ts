import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/app-error';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // Erros operacionais conhecidos disparados pelo AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      details: err.details || undefined,
    });
    return;
  }

  // Tratamento de erros específicos do Prisma ORM
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Código P2002: Violação de campo único (unique constraint)
    if (err.code === 'P2002') {
      const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'campo';
      res.status(409).json({
        status: 'error',
        message: `Já existe um registro com este ${target}.`,
        code: err.code,
      });
      return;
    }

    // Código P2025: Registro não encontrado para atualização/deleção
    if (err.code === 'P2025') {
      res.status(404).json({
        status: 'error',
        message: 'O recurso solicitado não foi encontrado no banco de dados.',
        code: err.code,
      });
      return;
    }
  }

  // Log detalhado em desenvolvimento
  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ [Unhandled Error]:', err);
  }

  // Resposta padrão para falhas inesperadas internas
  res.status(500).json({
    status: 'error',
    message: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.',
  });
}
