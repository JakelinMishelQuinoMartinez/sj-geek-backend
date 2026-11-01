import { Router } from 'express';
import * as controller from '../controllers/contenidos.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/rbac.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { contenidoValidator } from '../validators/contenido.validator.js';
import { body } from 'express-validator';

const router = Router();
router.get('/', controller.list);
router.get('/pendientes', authenticate, requireAdmin, controller.pending);
router.get('/:id', controller.get);
router.post('/', authenticate, contenidoValidator, validate, controller.create);
router.put('/:id', authenticate, requireAdmin, contenidoValidator, validate, controller.update);
router.delete('/:id', authenticate, requireAdmin, controller.remove);
router.patch('/:id/estado', authenticate, requireAdmin,
  body('estado').isIn(['APROBADO', 'RECHAZADO']), body('motivo_rechazo').optional().trim().isLength({ max: 255 }), validate, controller.setEstado);
export default router;