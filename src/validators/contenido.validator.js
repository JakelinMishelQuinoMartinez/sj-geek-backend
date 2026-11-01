import { body } from 'express-validator';
export const contenidoValidator = [
  body('titulo').trim().isLength({ min: 1, max: 150 }),
  body('sinopsis').trim().isLength({ min: 10 }),
  body('categoria_id').isInt({ min: 1 }),
  body('tipo_id').isInt({ min: 1 }),
  body('anio').isInt({ min: 1888, max: 2100 }),
  body('duracion_minutos').optional({ nullable: true }).isInt({ min: 1 }),
  body('imagen_url').optional({ nullable: true }).isURL(),
  body('clasificacion').optional().trim().isLength({ min: 1, max: 20 })
];