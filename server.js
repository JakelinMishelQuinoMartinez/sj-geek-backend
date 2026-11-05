import app from './app.js';
import env from './src/config/env.js';
import { testConnection } from './src/config/db.js';

export class Server {
  async start() {
    const dbOk = await testConnection();
    if (!dbOk) {
      console.error('No se pudo conectar a la base de datos. Revisa tu archivo .env');
      process.exit(1);
    }

    app.listen(env.port, () => {
      console.log('Servidor S&J-GEEK corriendo en http://localhost:' + env.port);
      console.log('Health: http://localhost:' + env.port + '/health');
      console.log('Swagger: http://localhost:' + env.port + '/api-docs');
    });
  }
}

new Server().start();