import { pool } from '../config/db.js';

export class ResenaRepository {
  async findByContenido(id) {
    const [rows] = await pool.execute(
      `SELECT r.*, u.nombre AS autor_nombre,
       (SELECT COUNT(*) FROM reaccion_resenas WHERE resena_id=r.id AND tipo='LIKE') likes,
       (SELECT COUNT(*) FROM reaccion_resenas WHERE resena_id=r.id AND tipo='DISLIKE') dislikes
       FROM resenas r JOIN usuarios u ON u.id=r.usuario_id WHERE r.contenido_id=? ORDER BY r.created_at DESC`, [id]);
    return rows;
  }
  async findById(id) { const [rows] = await pool.execute('SELECT * FROM resenas WHERE id=?', [id]); return rows[0] || null; }
  async create(data, userId) {
    const c = await pool.getConnection();
    try {
      await c.beginTransaction();
      const [r] = await c.execute('INSERT INTO resenas (contenido_id, usuario_id, titulo_resena, comentario, rating) VALUES (?, ?, ?, ?, ?)',
        [data.contenido_id, userId, data.titulo, data.comentario, data.rating]);
      await c.execute(
        `INSERT INTO contenido_estadisticas (contenido_id,total_votos,suma_ratings,total_recomendadas) VALUES (?,1,?,?)
         ON DUPLICATE KEY UPDATE total_votos=total_votos+1, suma_ratings=suma_ratings+VALUES(suma_ratings),
         total_recomendadas=total_recomendadas+VALUES(total_recomendadas)`,
        [data.contenido_id, data.rating, data.rating >= 6 ? 1 : 0]);
      await c.commit(); return r.insertId;
    } catch (e) { await c.rollback(); throw e; } finally { c.release(); }
  }
  async update(review, data) {
    const c = await pool.getConnection();
    try {
      await c.beginTransaction();
      await c.execute('UPDATE resenas SET titulo_resena=?, comentario=?, rating=? WHERE id=?',
        [data.titulo, data.comentario, data.rating, review.id]);
      await c.execute(
        'UPDATE contenido_estadisticas SET suma_ratings=suma_ratings-?+?, total_recomendadas=total_recomendadas-?+? WHERE contenido_id=?',
        [review.rating, data.rating, review.rating >= 6 ? 1 : 0, data.rating >= 6 ? 1 : 0, review.contenido_id]);
      await c.commit();
    } catch (e) { await c.rollback(); throw e; } finally { c.release(); }
  }
  async remove(review) {
    const c = await pool.getConnection();
    try {
      await c.beginTransaction();
      await c.execute('DELETE FROM resenas WHERE id=?', [review.id]);
      await c.execute(
        `UPDATE contenido_estadisticas SET total_votos=GREATEST(total_votos-1,0),
         suma_ratings=GREATEST(suma_ratings-?,0), total_recomendadas=GREATEST(total_recomendadas-?,0) WHERE contenido_id=?`,
        [review.rating, review.rating >= 6 ? 1 : 0, review.contenido_id]);
      await c.commit();
    } catch (e) { await c.rollback(); throw e; } finally { c.release(); }
  }
}
export default new ResenaRepository();