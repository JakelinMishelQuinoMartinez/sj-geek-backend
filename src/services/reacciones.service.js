import reaccionRepository from '../repositories/reaccion.repository.js';
import resenaRepository from '../repositories/resena.repository.js';
export class ReaccionesService {
  async set(resenaId, user, tipo) {
    const review = await resenaRepository.findById(resenaId);
    if (!review) { const e = new Error('Reseña no encontrada'); e.status = 404; throw e; }
    if (review.usuario_id === user.id) { const e = new Error('No puedes reaccionar a tu propia reseña'); e.status = 403; throw e; }
    await reaccionRepository.set(resenaId, user.id, tipo);
  }
}
export default new ReaccionesService();