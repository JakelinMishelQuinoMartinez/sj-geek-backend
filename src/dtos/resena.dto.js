export class ResenaDto {
  transform(row) {
  if (!row) return null;
  return { ...row, autor: { id: row.usuario_id, nombre: row.autor_nombre } };
  }
}

export const resenaDto = row => new ResenaDto().transform(row);