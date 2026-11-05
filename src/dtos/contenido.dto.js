export class ContenidoDto {
  transform(row) {
  if (!row) return null;
  return {
    ...row,
    categoria: { id: row.categoria_id, nombre: row.categoria_nombre },
    tipo: { id: row.tipo_id, nombre: row.tipo_nombre },
    autor: { id: row.usuario_id, nombre: row.autor_nombre }
  };
  }
}

export const contenidoDto = row => new ContenidoDto().transform(row);