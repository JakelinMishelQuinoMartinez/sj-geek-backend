import service from '../services/ranking.service.js';
import { ok } from '../utils/responseHandler.js';

export async function list(req,res,next) { 
    try { return ok(res, await service.list()); 
    } catch(e) { next(e); 
    } }