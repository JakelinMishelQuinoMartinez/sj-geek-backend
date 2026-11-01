import { body } from 'express-validator';
export const registerValidator = [
  body('nombre').trim().isLength({ min: 2, max: 100 }),
  body('email').trim().isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/[A-Z]/).matches(/[a-z]/).matches(/[0-9]/)
];
export const loginValidator = [body('email').trim().isEmail(), body('password').isString().notEmpty()];