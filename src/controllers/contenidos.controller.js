import service from '../services/contenidos.service.js';
import { ok } from '../utils/responseHandler.js';

export class ContenidosController {
  async list(req, res, next) {
    try {
      return ok(res, await service.list({
        categoriaId: req.query.categoria,
        tipoId: req.query.tipo,
        search: req.query.buscar || req.query.search,
        orderBy: req.query.ordenar || req.query.orderBy
      }));
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try { return ok(res, await service.get(req.params.id)); }
    catch (error) { next(error); }
  }

  async pending(req, res, next) {
    try { return ok(res, await service.pending()); }
    catch (error) { next(error); }
  }

  async create(req, res, next) {
    try { return ok(res, await service.create(req.body, req.user), 'Contenido creado', 201); }
    catch (error) { next(error); }
  }

  async update(req, res, next) {
    try { return ok(res, await service.update(req.params.id, req.body), 'Contenido actualizado'); }
    catch (error) { next(error); }
  }

  async setEstado(req, res, next) {
    try {
      await service.setEstado(req.params.id, req.body, req.user.id);
      return ok(res, null, 'Estado actualizado');
    } catch (error) { next(error); }
  }

  async remove(req, res, next) {
    try {
      await service.remove(req.params.id);
      return ok(res, null, 'Contenido eliminado');
    } catch (error) { next(error); }
  }
}

export default new ContenidosController();
