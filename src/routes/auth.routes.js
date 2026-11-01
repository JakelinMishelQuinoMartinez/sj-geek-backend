import { Router } from 'express';
import * as controller from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';

const router = Router();
router.post('/register', registerValidator, validate, controller.register);
router.post('/login', loginValidator, validate, controller.login);
router.get('/profile', authenticate, controller.profile);
export default router;