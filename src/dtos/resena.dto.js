export function resenaDto(row) {
  if (!row) return null;
  return { ...row, autor: { id: row.usuario_id, nombre: row.autor_nombre } };
}