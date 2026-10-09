import { Router } from 'express';
import { WeatherController } from '../controllers/weather.controller';

const weatherRoutes = Router();
const weatherController = new WeatherController();

// GET /weather/barra-grande -> Dados em tempo real de vento e clima em BG (TASK-API-05)
weatherRoutes.get('/barra-grande', weatherController.getBarraGrande);

// GET /weather/barra-grande/history -> Histórico e previsão horária de vento para gráficos na UI (TASK-UI-06)
weatherRoutes.get('/barra-grande/history', weatherController.getBarraGrandeHistory);

export { weatherRoutes };
