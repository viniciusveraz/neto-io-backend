import { Router } from 'express';
import {
  TouristSpotController,
  listSpotsSchema,
  createSpotSchema,
  updateSpotSchema,
} from '../controllers/tourist-spot.controller';
import {
  ReviewController,
  createReviewSchema,
} from '../controllers/review.controller';
import { validate } from '../middlewares/validate.middleware';
import { ensureAuthenticated, ensureAdmin } from '../middlewares/auth.middleware';

const touristSpotRoutes = Router();
const spotController = new TouristSpotController();
const reviewController = new ReviewController();

// Listagem e busca com filtros e paginação (TASK-API-04, TASK-API-06, TASK-UI-03)
touristSpotRoutes.get('/', validate(listSpotsSchema), spotController.list);

// Obtenção de detalhes de um local específico
touristSpotRoutes.get('/:id', spotController.getOne);

// Cadastro de novos pontos turísticos (autenticado)
touristSpotRoutes.post('/', ensureAuthenticated, validate(createSpotSchema), spotController.create);

// Atualização de pontos turísticos (autenticado)
touristSpotRoutes.put('/:id', ensureAuthenticated, validate(updateSpotSchema), spotController.update);

// Exclusão de pontos turísticos (restrito a admin)
touristSpotRoutes.delete('/:id', ensureAuthenticated, ensureAdmin, spotController.delete);

// Avaliações do local (TASK-UI-04)
touristSpotRoutes.get('/:id/reviews', reviewController.listBySpot);
touristSpotRoutes.post(
  '/:id/reviews',
  ensureAuthenticated,
  validate(createReviewSchema),
  reviewController.create
);

export { touristSpotRoutes };
