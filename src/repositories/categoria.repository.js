import { pool } from '../config/db.js';

export class CategoriaRepository {
  async findAll() { const [rows] = await pool.query('SELECT id, nombre, descripcion FROM categorias ORDER BY nombre'); return rows; }
  async findById(id) { const [rows] = await pool.execute('SELECT id, nombre, descripcion FROM categorias WHERE id = ?', [id]); return rows[0] || null; }
  async create(nombre, descripcion) {
    const [result] = await pool.execute('INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion || null]);
    return this.findById(result.insertId);
  }
  async update(id, nombre, descripcion) {
    await pool.execute('UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion || null, id]);
    return this.findById(id);
  }
  async remove(id) { const [result] = await pool.execute('DELETE FROM categorias WHERE id = ?', [id]); return result.affectedRows > 0; }
}
export default new CategoriaRepository();