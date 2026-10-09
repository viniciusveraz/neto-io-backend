import { Router } from 'express';
import { HomeController } from '../controllers/home.controller';

const homeRoutes = Router();
const homeController = new HomeController();

// GET /home -> Agregação de destaques turísticos e vento em BG para a tela inicial (TASK-UI-01)
homeRoutes.get('/', homeController.getHome);

export { homeRoutes };
