import service from '../services/categorias.service.js';
import { ok } from '../utils/responseHandler.js';

export class CategoriasController {
  async list(req,res,next) {
    try {
        return ok(res, await service.list());
    } catch(e) {
        next(e);
} }

  async create(req,res,next) {
    try {
        return ok(res, await service.create(req.body), 'Categoría creada', 201);
    } catch(e) {
        next(e);
} }

  async update(req,res,next) {
    try {
        return ok(res, await service.update(req.params.id, req.body), 'Categoría actualizada');
    } catch(e) {
        next(e);
} }

  async remove(req,res,next) {
    try {
        await service.remove(req.params.id);
        return ok(res, null, 'Categoría eliminada');
    } catch(e) {
        next(e);
} }
}

export default new CategoriasController();