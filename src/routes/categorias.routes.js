import { Router } from 'express';
import * as controller from '../controllers/categorias.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/rbac.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { categoriaValidator } from '../validators/categoria.validator.js';

const router = Router();
router.get('/', controller.list);
router.post('/', authenticate, requireAdmin, categoriaValidator, validate, controller.create);
router.put('/:id', authenticate, requireAdmin, categoriaValidator, validate, controller.update);
router.delete('/:id', authenticate, requireAdmin, controller.remove);
export default router;