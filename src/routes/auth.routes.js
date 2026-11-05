import { Router } from 'express';
import controller from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';

export class AuthRoutes {
  constructor() {
    this.router = Router();
    this.router.post('/register', registerValidator, validate, controller.register);
    this.router.post('/login', loginValidator, validate, controller.login);
    this.router.get('/profile', authenticate, controller.profile);
  }
}

export default new AuthRoutes().router;