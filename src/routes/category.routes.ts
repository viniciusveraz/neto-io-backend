import { Router } from 'express';
import {
  CategoryController,
  createCategorySchema,
} from '../controllers/category.controller';
import { validate } from '../middlewares/validate.middleware';
import { ensureAuthenticated, ensureAdmin } from '../middlewares/auth.middleware';

const categoryRoutes = Router();
const categoryController = new CategoryController();

categoryRoutes.get('/', categoryController.list);
categoryRoutes.get('/:slug', categoryController.getOne);
categoryRoutes.post(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  validate(createCategorySchema),
  categoryController.create
);

export { categoryRoutes };
