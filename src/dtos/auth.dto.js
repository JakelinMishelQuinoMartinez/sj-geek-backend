export class AuthDto {
  transform(user) {
    return user ? { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } : null;
  }
}

export const authDto = user => new AuthDto().transform(user);