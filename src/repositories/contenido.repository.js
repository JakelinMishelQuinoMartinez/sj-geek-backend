import { pool } from '../config/db.js';

const selectBase = `
  SELECT c.*, cat.nombre AS categoria_nombre, tc.nombre AS tipo_nombre, u.nombre AS autor_nombre,
         e.total_votos, e.suma_ratings, e.rating_promedio, e.porcentaje_fresco
  FROM contenidos c JOIN categorias cat ON cat.id = c.categoria_id
  JOIN tipos_contenido tc ON tc.id = c.tipo_id JOIN usuarios u ON u.id = c.usuario_id
  LEFT JOIN contenido_estadisticas e ON e.contenido_id = c.id`;

export class ContenidoRepository {
  async findAll(filters = {}) {
    const conditions = ["c.estado = 'APROBADO'"]; const params = [];
    if (filters.categoriaId) { conditions.push('c.categoria_id = ?'); params.push(filters.categoriaId); }
    if (filters.tipoId) { conditions.push('c.tipo_id = ?'); params.push(filters.tipoId); }
    if (filters.search) { conditions.push('(c.titulo LIKE ? OR c.sinopsis LIKE ?)'); params.push(`%${filters.search}%`, `%${filters.search}%`); }
    let order = 'c.created_at DESC';
    if (filters.orderBy === 'popularidad') order = 'e.total_votos DESC, c.created_at DESC';
    if (['rating', 'calificacion'].includes(filters.orderBy)) order = 'e.rating_promedio DESC, c.created_at DESC';
    if (['ranking', 'bayesiano'].includes(filters.orderBy)) order = 'COALESCE((SELECT rating_ponderado FROM v_ranking_base WHERE contenido_id = c.id), 0) DESC';
    const [rows] = await pool.execute(`${selectBase} WHERE ${conditions.join(' AND ')} ORDER BY ${order}`, params);
    return rows;
  }
  async findApprovedById(id) {
    const [rows] = await pool.execute(`${selectBase} WHERE c.id = ? AND c.estado = 'APROBADO'`, [id]); return rows[0] || null;
  }
  async findById(id) {
    const [rows] = await pool.execute(`${selectBase} WHERE c.id = ?`, [id]); return rows[0] || null;
  }
  async findPending() {
    const [rows] = await pool.query(`${selectBase} WHERE c.estado = 'PENDIENTE' ORDER BY c.created_at DESC`); return rows;
  }
  async create(data, user) {
    const estado = user.rol === 'ADMIN' ? 'APROBADO' : 'PENDIENTE';
    const [result] = await pool.execute(
      `INSERT INTO contenidos (titulo, sinopsis, categoria_id, tipo_id, anio, duracion_minutos, imagen_url, clasificacion, estado, usuario_id, revisado_por, revisado_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.titulo, data.sinopsis, data.categoria_id, data.tipo_id, data.anio, data.duracion_minutos || null,
       data.imagen_url || null, data.clasificacion || '+13', estado, user.id,
       user.rol === 'ADMIN' ? user.id : null, user.rol === 'ADMIN' ? new Date() : null]);
    return { id: result.insertId, estado };
  }
  async update(id, data) {
    await pool.execute(
      `UPDATE contenidos SET titulo=?, sinopsis=?, categoria_id=?, tipo_id=?, anio=?,
       duracion_minutos=?, imagen_url=?, clasificacion=? WHERE id=?`,
      [data.titulo, data.sinopsis, data.categoria_id, data.tipo_id, data.anio, data.duracion_minutos || null,
       data.imagen_url || null, data.clasificacion || '+13', id]);
    return this.findById(id);
  }
  async setEstado(id, estado, motivo, adminId) {
    const [result] = await pool.execute(
      'UPDATE contenidos SET estado=?, motivo_rechazo=?, revisado_por=?, revisado_at=NOW() WHERE id=?',
      [estado, estado === 'RECHAZADO' ? motivo || 'No especificado' : null, adminId, id]);
    return result.affectedRows > 0;
  }
  async remove(id) { const [result] = await pool.execute('DELETE FROM contenidos WHERE id=?', [id]); return result.affectedRows > 0; }
}
export default new ContenidoRepository();