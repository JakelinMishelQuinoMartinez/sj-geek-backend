import dotenv from 'dotenv';

dotenv.config();

const env = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'development-only-secret',
  frontendUrl: process.env.FRONTEND_URL || 'http://127.0.0.1:5500',
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' } : undefined,
  }
};

export default env;