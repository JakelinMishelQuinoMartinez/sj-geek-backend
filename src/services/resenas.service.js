import resenaRepository from '../repositories/resena.repository.js';
import { resenaDto } from '../dtos/resena.dto.js';
export class ResenasService {
  async list(contenidoId) { return (await resenaRepository.findByContenido(contenidoId)).map(resenaDto); }
  async create(data, userId) { return { id: await resenaRepository.create(data, userId) }; }
  async update(id, data, user) {
    const review = await resenaRepository.findById(id);
    if (!review || (review.usuario_id !== user.id && user.rol !== 'ADMIN')) { const e = new Error('Reseña no encontrada o sin permiso'); e.status = 404; throw e; }
    await resenaRepository.update(review, data);
  }
  async remove(id, user) {
    const review = await resenaRepository.findById(id);
    if (!review || (review.usuario_id !== user.id && user.rol !== 'ADMIN')) { const e = new Error('Reseña no encontrada o sin permiso'); e.status = 404; throw e; }
    await resenaRepository.remove(review);
  }
}
export default new ResenasService();