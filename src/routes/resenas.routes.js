import { Router } from 'express';
import controller from '../controllers/resenas.controller.js';
import reactionController from '../controllers/reacciones.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { resenaValidator } from '../validators/resena.validator.js';
import { body } from 'express-validator';

export class ResenasRoutes {
  constructor() {
    this.router = Router();
    this.router.get('/contenido/:contenidoId', controller.list);
    this.router.post('/', authenticate, resenaValidator, validate, controller.create);
    this.router.put('/:id', authenticate, resenaValidator, validate, controller.update);
    this.router.delete('/:id', authenticate, controller.remove);
    this.router.post('/:id/reaccion', authenticate, body('tipo').isIn(['LIKE', 'DISLIKE']), validate, reactionController.set);
  }
}

export default new ResenasRoutes().router;