import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import env from './env.js';
import { pool } from './db.js';

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.jwtSecret
}, async (payload, done) => {
  try {
    const [users] = await pool.execute(
      'SELECT u.id, u.nombre, u.email, u.activo, r.nombre AS rol FROM usuarios u JOIN roles r ON r.id = u.rol_id WHERE u.id = ?',
      [payload.sub]
    );
    if (!users.length || !users[0].activo) return done(null, false);
    return done(null, users[0]);
  } catch (error) {
    return done(error, false);
  }
}));

export default passport;