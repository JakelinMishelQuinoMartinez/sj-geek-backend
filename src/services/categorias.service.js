import categoriaRepository from '../repositories/categoria.repository.js';
export class CategoriasService {
  list() { return categoriaRepository.findAll(); }
  async create(data) { return categoriaRepository.create(data.nombre, data.descripcion); }
  async update(id, data) {
    const category = await categoriaRepository.findById(id);
    if (!category) { const e = new Error('Categoría no encontrada'); e.status = 404; throw e; }
    return categoriaRepository.update(id, data.nombre, data.descripcion);
  }
  async remove(id) {
    if (!(await categoriaRepository.remove(id))) { const e = new Error('Categoría no encontrada'); e.status = 404; throw e; }
  }
}
export default new CategoriasService();