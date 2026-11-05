import service from '../services/ranking.service.js';
import { ok } from '../utils/responseHandler.js';

export class RankingController {
  async list(req, res, next) {
    try { return ok(res, await service.list()); }
    catch (error) { next(error); }
  }
}

export default new RankingController();
