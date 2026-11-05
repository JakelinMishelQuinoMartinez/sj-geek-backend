import service from '../services/resenas.service.js';
import { ok } from '../utils/responseHandler.js';
export class ResenasController {
  async list(req,res,next) {
    try {
        return ok(res, await service.list(req.params.contenidoId));
    } catch(e) {
        next(e);
    } }

  async create(req,res,next) {
    try {
        return ok(res, await service.create(req.body, req.user.id), 'Reseña creada', 201);
    } catch(e) {
        next(e);
    } }

  async update(req,res,next) {
    try {
        await service.update(req.params.id, req.body, req.user);
        return ok(res, null, 'Reseña actualizada');
    } catch(e) {
        next(e);
    } }

  async remove(req,res,next) {
    try {
        await service.remove(req.params.id, req.user);
        return ok(res, null, 'Reseña eliminada');
    } catch(e) {
        next(e);
    } }
}

export default new ResenasController();