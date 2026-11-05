import { Router } from 'express';
import controller from '../controllers/ranking.controller.js';
export class RankingRoutes {
  constructor() {
    this.router = Router();
    this.router.get('/', controller.list);
  }
}

export default new RankingRoutes().router;