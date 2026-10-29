import app from './app.js';
import env from './src/config/env.js';
import { testConnection } from './src/config/db.js';

async function startServer() {
  const dbOk = await testConnection();
  if (!dbOk) {
    console.error('No se pudo conectar a la base de datos. Revisa tu archivo .env');
    process.exit(1);
  }

  app.listen(env.port, () => {
    console.log('Servidor S&J-GEEK corriendo en http://localhost:' + env.port);
  });
}

startServer();