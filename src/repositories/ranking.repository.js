import { pool } from '../config/db.js';

export class RankingRepository {
  async findAll() {
    const [rows] = await pool.query(`
      SELECT c.id,c.titulo,c.imagen_url,c.anio,cat.nombre AS categoria_nombre,
             COALESCE(r.rating_ponderado,e.rating_promedio,0) AS rating
      FROM contenidos c JOIN categorias cat ON cat.id=c.categoria_id
      LEFT JOIN contenido_estadisticas e ON e.contenido_id=c.id
      LEFT JOIN v_ranking_base r ON r.contenido_id=c.id
      WHERE c.estado='APROBADO' ORDER BY rating DESC,c.titulo`);
    return rows;
  }
}
export default new RankingRepository();
