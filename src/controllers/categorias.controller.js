import service from '../services/categorias.service.js';
import { ok } from '../utils/responseHandler.js';
export async function list(req,res,next) { 
    try { 
        return ok(res, await service.list()); 
    } catch(e) { 
        next(e); 
} }

export async function create(req,res,next) { 
    try { 
        return ok(res, await service.create(req.body), 'Categoría creada', 201); 
    } catch(e) { 
        next(e); 
} }

export async function update(req,res,next) { 
    try { 
        return ok(res, await service.update(req.params.id, req.body), 'Categoría actualizada'); 
    } catch(e) { 
        next(e); 
} }

export async function remove(req,res,next) { 
    try { 
        await service.remove(req.params.id); 
        return ok(res, null, 'Categoría eliminada'); 
    } catch(e) { 
        next(e); 
} }