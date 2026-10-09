import { Request, Response, NextFunction } from 'express';
import { HomeService } from '../services/home.service';

const homeService = new HomeService();

export class HomeController {
  async getHome(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await homeService.getHomePayload();
      res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
