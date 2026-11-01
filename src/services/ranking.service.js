import rankingRepository from '../repositories/ranking.repository.js';
export class RankingService { list() { return rankingRepository.findAll(); } }
export default new RankingService();