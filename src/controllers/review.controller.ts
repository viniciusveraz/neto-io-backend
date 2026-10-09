import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ReviewService } from '../services/review.service';

const reviewService = new ReviewService();

export const createReviewSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID do ponto turístico é obrigatório.'),
  }),
  body: z.object({
    rating: z
      .number({ required_error: 'A nota de avaliação é obrigatória.' })
      .int('A nota deve ser um número inteiro.')
      .min(1, 'A nota mínima é 1 estrela.')
      .max(5, 'A nota máxima é 5 estrelas.'),
    comment: z.string().min(3, 'O comentário deve ter pelo menos 3 caracteres.').max(1000),
  }),
});

export class ReviewController {
  async listBySpot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = await reviewService.listReviewsForSpot(id);
      res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { rating, comment } = req.body;

      const result = await reviewService.createReview({
        touristSpotId: id,
        userId,
        rating,
        comment,
      });

      res.status(result.updated ? 200 : 201).json({
        status: 'success',
        message: result.updated ? 'Sua avaliação foi atualizada com sucesso!' : 'Avaliação publicada com sucesso!',
        data: result.review,
      });
    } catch (error) {
      next(error);
    }
  }
}
