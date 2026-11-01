import { validationResult } from 'express-validator';

export function validate(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(422).json({
      status: 'error',
      message: 'Los datos enviados no son válidos',
      errors: result.array().map(error => ({ field: error.path, message: error.msg }))
    });
  }
  return next();
}