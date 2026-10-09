import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CategoryService } from '../services/category.service';

const categoryService = new CategoryService();

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'O nome da categoria é obrigatório.'),
    slug: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
  }),
});

export class CategoryController {
  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryService.listCategories();
      res.status(200).json({
        status: 'success',
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const category = await categoryService.getCategoryBySlug(slug);
      res.status(200).json({
        status: 'success',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json({
        status: 'success',
        message: 'Categoria criada com sucesso!',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
}
