import { Router } from 'express';
import * as controller from '../controllers/resenas.controller.js';
import * as reactionController from '../controllers/reacciones.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { resenaValidator } from '../validators/resena.validator.js';
import { body } from 'express-validator';

const router = Router();
router.get('/contenido/:contenidoId', controller.list);
router.post('/', authenticate, resenaValidator, validate, controller.create);
router.put('/:id', authenticate, resenaValidator, validate, controller.update);
router.delete('/:id', authenticate, controller.remove);
router.post('/:id/reaccion', authenticate, body('tipo').isIn(['LIKE', 'DISLIKE']), validate, reactionController.set);
export default router;