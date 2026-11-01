import { pool } from '../config/db.js';
export class ReaccionRepository {
  async set(resenaId, usuarioId, tipo) {
    await pool.execute(
      `INSERT INTO reaccion_resenas (resena_id,usuario_id,tipo) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE tipo=VALUES(tipo), updated_at=CURRENT_TIMESTAMP`,
      [resenaId, usuarioId, tipo]);
  }
}
export default new ReaccionRepository();