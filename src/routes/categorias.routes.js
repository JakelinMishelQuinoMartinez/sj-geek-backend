import { Router } from 'express';
import controller from '../controllers/categorias.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/rbac.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { categoriaValidator } from '../validators/categoria.validator.js';

export class CategoriasRoutes {
  constructor() {
    this.router = Router();
    this.router.get('/', controller.list);
    this.router.post('/', authenticate, requireAdmin, categoriaValidator, validate, controller.create);
    this.router.put('/:id', authenticate, requireAdmin, categoriaValidator, validate, controller.update);
    this.router.delete('/:id', authenticate, requireAdmin, controller.remove);
  }
}

export default new CategoriasRoutes().router;