import service from '../services/reacciones.service.js';
import { ok } from '../utils/responseHandler.js';
export async function set(req,res,next) {
    try {
        await service.set(req.params.id, req.user, req.body.tipo);
        return ok(res, null, 'Reacción registrada');
    } catch(e) {
        next(e);
    } }