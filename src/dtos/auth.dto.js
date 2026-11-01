export function authDto(user) {
  return user ? { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } : null;
}