import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import usuarioRepository from '../repositories/usuario.repository.js';
import { authDto } from '../dtos/auth.dto.js';

function httpError(status, message) { const error = new Error(message); error.status = status; return error; }

export class AuthService {
  async register(data) {
    if (await usuarioRepository.findByEmail(data.email))
      throw httpError(409, 'El correo ya está registrado');
    const passwordHash = await bcrypt.hash(data.password, 10);
    return authDto(await usuarioRepository.create({ nombre: data.nombre, email: data.email, passwordHash }));
  }
  async login(email, password) {
    const user = await usuarioRepository.findByEmail(email);
    if (!user || !user.activo || !(await bcrypt.compare(password, user.password_hash)))
      throw httpError(401, 'Credenciales inválidas');
    const token = jwt.sign({ sub: String(user.id), email: user.email, rol: user.rol }, env.jwtSecret, { expiresIn: '8h' });
    return { token, user: authDto(user) };
  }
  async profile(id) { return authDto(await usuarioRepository.findById(id)); }
}
export default new AuthService();