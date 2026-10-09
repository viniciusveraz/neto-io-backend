import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { TouristSpotService } from '../services/tourist-spot.service';

const touristSpotService = new TouristSpotService();

export const listSpotsSchema = z.object({
  query: z.object({
    city: z.string().optional(),
    category: z.string().optional(),
    search: z.string().optional(),
    kitesurfOnly: z
      .string()
      .optional()
      .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
    featuredOnly: z
      .string()
      .optional()
      .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
    page: z.string().optional().transform((val) => (val ? Number(val) : 1)),
    limit: z.string().optional().transform((val) => (val ? Number(val) : 10)),
  }),
});

export const createSpotSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'O nome do local é obrigatório.'),
    slug: z.string().optional(),
    description: z.string().min(10, 'A descrição deve ter no mínimo 10 caracteres.'),
    city: z.string().min(2, 'A cidade é obrigatória (ex: Barra Grande, Luís Correia, Parnaíba, Ilha Grande).'),
    address: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    imageUrl: z.string().url('URL da imagem inválida.').optional(),
    additionalImages: z.string().optional(),
    isFeatured: z.boolean().optional(),
    kitesurfSpot: z.boolean().optional(),
    contactPhone: z.string().optional(),
    instagram: z.string().optional(),
    website: z.string().optional(),
    categoryId: z.string().min(1, 'O ID da categoria é obrigatório.'),
  }),
});

export const updateSpotSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID é obrigatório.'),
  }),
  body: createSpotSchema.shape.body.partial(),
});

export class TouristSpotController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query as any;
      const result = await touristSpotService.listSpots(filters);
      res.status(200).json({
        status: 'success',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const spot = await touristSpotService.getSpotByIdOrSlug(id);
      res.status(200).json({
        status: 'success',
        data: spot,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const spot = await touristSpotService.createSpot(req.body);
      res.status(201).json({
        status: 'success',
        message: 'Ponto turístico cadastrado com sucesso!',
        data: spot,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const spot = await touristSpotService.updateSpot(id, req.body);
      res.status(200).json({
        status: 'success',
        message: 'Ponto turístico atualizado com sucesso!',
        data: spot,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await touristSpotService.deleteSpot(id);
      res.status(200).json({
        status: 'success',
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
