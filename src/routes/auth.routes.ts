import { Router } from 'express';
import {
  AuthController,
  registerSchema,
  loginSchema,
} from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authRateLimiter } from '../middlewares/rate-limit.middleware';
import { ensureAuthenticated } from '../middlewares/auth.middleware';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/register', authRateLimiter, validate(registerSchema), authController.register);
authRoutes.post('/login', authRateLimiter, validate(loginSchema), authController.login);
authRoutes.get('/me', ensureAuthenticated, authController.getMe);

export { authRoutes };
