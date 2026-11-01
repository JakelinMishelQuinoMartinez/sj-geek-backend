import contenidoRepository from '../repositories/contenido.repository.js';
import { contenidoDto } from '../dtos/contenido.dto.js';
function httpError(status, message) { const e = new Error(message); e.status = status; return e; }
export class ContenidosService {
  async list(filters) { return (await contenidoRepository.findAll(filters)).map(contenidoDto); }
  async get(id) { const row = await contenidoRepository.findApprovedById(id);
    if (!row) throw httpError(404, 'Contenido no encontrado'); return contenidoDto(row); }
  async pending() { return (await contenidoRepository.findPending()).map(contenidoDto); }
  async create(data, user) {
    const created = await contenidoRepository.create(data, user);
    const row = await contenidoRepository.findById(created.id);
    return { contenido: contenidoDto(row), estado: created.estado };
  }
  async update(id, data) {
    if (!(await contenidoRepository.findById(id))) throw httpError(404, 'Contenido no encontrado');
    return contenidoDto(await contenidoRepository.update(id, data));
  }
  async setEstado(id, data, adminId) {
    if (!(await contenidoRepository.setEstado(id, data.estado, data.motivo_rechazo, adminId))) throw httpError(404, 'Contenido no encontrado');
  }
  async remove(id) { if (!(await contenidoRepository.remove(id))) throw httpError(404, 'Contenido no encontrado'); }
}
export default new ContenidosService();