import authService from '../services/auth.service.js';
import { ok } from '../utils/responseHandler.js';

export class AuthController {
  async register(req, res, next) {
        try {
            return ok(res, await authService.register(req.body), 'Registro exitoso', 201);
        } catch (e) { next(e); } }

  async login(req, res, next) {
        try {
            return ok(res, await authService.login(req.body.email, req.body.password), 'Inicio de sesión exitoso');
        } catch (e) {
        next(e); } }

  async profile(req, res, next) {
        try {
            return ok(res, await authService.profile(req.user.id));
        } catch (e) {
            next(e); } }
}

export default new AuthController();