import { Router } from 'express';
import controller from '../controllers/contenidos.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/rbac.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { contenidoValidator } from '../validators/contenido.validator.js';
import { body } from 'express-validator';

export class ContenidosRoutes {
  constructor() {
    this.router = Router();
    this.router.get('/', controller.list);
    this.router.get('/pendientes', authenticate, requireAdmin, controller.pending);
    this.router.get('/:id', controller.get);
    this.router.post('/', authenticate, contenidoValidator, validate, controller.create);
    this.router.put('/:id', authenticate, requireAdmin, contenidoValidator, validate, controller.update);
    this.router.delete('/:id', authenticate, requireAdmin, controller.remove);
    this.router.patch('/:id/estado', authenticate, requireAdmin,
      body('estado').isIn(['APROBADO', 'RECHAZADO']), body('motivo_rechazo').optional().trim().isLength({ max: 255 }), validate, controller.setEstado);
  }
}

export default new ContenidosRoutes().router;