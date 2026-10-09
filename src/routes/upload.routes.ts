import { Router } from 'express';
import {
  UploadController,
  uploadMiddleware,
} from '../controllers/upload.controller';
import { ensureAuthenticated } from '../middlewares/auth.middleware';

const uploadRoutes = Router();
const uploadController = new UploadController();

// POST /upload -> Upload de foto (autenticado)
uploadRoutes.post('/', ensureAuthenticated, uploadMiddleware.single('file'), uploadController.uploadImage);

export { uploadRoutes };
