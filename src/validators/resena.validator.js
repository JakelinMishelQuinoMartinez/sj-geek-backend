import { body } from 'express-validator';
export const resenaValidator = [
  body('contenido_id').isInt({ min: 1 }),
  body('titulo').trim().isLength({ min: 1, max: 120 }),
  body('comentario').trim().isLength({ min: 3 }),
  body('rating').isInt({ min: 1, max: 10 })
];