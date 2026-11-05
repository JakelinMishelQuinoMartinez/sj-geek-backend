import { Router } from 'express';
import authRoutes from './auth.routes.js';
import categoriasRoutes from './categorias.routes.js';
import contenidosRoutes from './contenidos.routes.js';
import resenasRoutes from './resenas.routes.js';
import rankingRoutes from './ranking.routes.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middlewares/auth.middleware.js';
import { ok, fail } from '../utils/responseHandler.js';
import resenaRepository from '../repositories/resena.repository.js';

export class ApiRoutes {
  constructor() {
    this.router = Router();
    this.configureUploads();
    this.router.use('/auth', authRoutes);
    this.router.use('/categorias', categoriasRoutes);
    this.router.use('/contenidos', contenidosRoutes);
    this.router.use('/resenas', resenasRoutes);
    this.router.use('/ranking', rankingRoutes);
    this.router.get('/historial', authenticate, async (req, res, next) => {
      try {
        return ok(res, await resenaRepository.findHistorial(req.user.id, req.query));
      } catch (e) { next(e); }
    });
  }

  configureUploads() {
    fs.mkdirSync(path.resolve('uploads'), { recursive: true });
    const storage = multer.diskStorage({
      destination: path.resolve('uploads'),
      filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`)
    });
    const upload = multer({
      storage,
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => cb(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype))
    });

    this.router.post('/upload', authenticate, upload.single('foto'), (req, res) => {
      if (!req.file) return fail(res, 'Selecciona una imagen válida de máximo 5 MB', 400);
      return ok(res, { url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` }, 'Imagen subida', 201);
    });
  }
}

export default new ApiRoutes().router;
