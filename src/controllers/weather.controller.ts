import { Request, Response, NextFunction } from 'express';
import { WeatherService } from '../services/weather.service';

const weatherService = new WeatherService();

export class WeatherController {
  async getBarraGrande(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await weatherService.getCurrentWeatherBarraGrande();
      res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBarraGrandeHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await weatherService.getWindHistoryAndForecast();
      res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
