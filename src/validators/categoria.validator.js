import { body } from 'express-validator';
export const categoriaValidator = [body('nombre').trim().isLength({ min: 2, max: 80 }), body('descripcion').optional().trim().isLength({ max: 255 })];