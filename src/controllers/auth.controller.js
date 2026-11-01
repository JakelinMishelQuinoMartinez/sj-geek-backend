import authService from '../services/auth.service.js';
import { ok } from '../utils/responseHandler.js';

export async function register(req, res, next) { 
    try { 
        return ok(res, await authService.register(req.body), 'Registro exitoso', 201); 
    } catch (e) { next(e); } }

export async function login(req, res, next) { 
    try { 
        return ok(res, await authService.login(req.body.email, req.body.password), 'Inicio de sesión exitoso'); 
    } catch (e) {
        next(e); } }
        
export async function profile(req, res, next) { 
    try { 
        return ok(res, await authService.profile(req.user.id)); 
    } catch (e) { 
        next(e); } }