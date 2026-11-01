import mysql from 'mysql2/promise';
import env from './env.js';

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  connectionLimit: 10
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('Conexion exitosa a MySQL');
    return true;
  } catch (error) {
    console.error('Error conectando a MySQL: ' + error.message);
    return false;
  }
}

export { pool, testConnection };
