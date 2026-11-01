import { pool } from '../config/db.js';

export class UsuarioRepository {
  async findByEmail(email) {
    const [rows] = await pool.execute(
      `SELECT u.id, u.nombre, u.email, u.password_hash, u.activo, r.nombre AS rol
       FROM usuarios u JOIN roles r ON r.id = u.rol_id WHERE u.email = ?`, [email]);
    return rows[0] || null;
  }
  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT u.id, u.nombre, u.email, u.activo, r.nombre AS rol
       FROM usuarios u JOIN roles r ON r.id = u.rol_id WHERE u.id = ?`, [id]);
    return rows[0] || null;
  }
  async create({ nombre, email, passwordHash }) {
    const [result] = await pool.execute(
      `INSERT INTO usuarios (nombre, email, password_hash, rol_id)
       SELECT ?, ?, ?, id FROM roles WHERE nombre = 'USER'`,
      [nombre, email, passwordHash]);
    return this.findById(result.insertId);
  }
}
export default new UsuarioRepository();