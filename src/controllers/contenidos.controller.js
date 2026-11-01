import service from '../services/contenidos.service.js';
import { ok } from '../utils/responseHandler.js';
export async function list(req,res,next) {
  try { return ok(res, await service.list({
    categoriaId: req.query.categoria, tipoId: req.query.tipo, search: req.query.buscar || req.query.search, orderBy: req.query.ordenar || req.query.orderBy
  })); } catch(e) { next(e); }
}
export async function get(req,res,next) { 
  try { return ok(res, await service.get(req.params.id)); 
  } catch(e) { next(e); } }

export async function pending(req,res,next) { 
  try { 
    return ok(res, await service.pending());
  } catch(e) { next(e); } }

export async function create(req,res,next) { 
  try { 
    return ok(res, await service.create(req.body, req.user), 'Contenido creado', 201); 
  } catch(e) { next(e); } }

export async function update(req,res,next) { 
  try { 
    return ok(res, await service.update(req.params.id, req.body), 'Contenido actualizado'); 
  } catch(e) { next(e); } }

export async function setEstado(req,res,next) { 
  try { 
    await service.setEstado(req.params.id, req.body, req.user.id); 
    return ok(res, null, 'Estado actualizado'); 
  } catch(e) { next(e); } }

export async function remove(req,res,next) { 
  try { 
    await service.remove(req.params.id); 
    return ok(res, null, 'Contenido eliminado'); 
  } catch(e) { next(e); } }