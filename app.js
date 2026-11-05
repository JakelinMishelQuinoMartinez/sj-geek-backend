import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';
import apiRouter from './src/routes/index.js';
import env from './src/config/env.js';
import { notFoundHandler, errorHandler } from './src/middlewares/errorHandler.js';
import { limiter } from './src/middlewares/rateLimiter.js';
import passport from './src/config/passport.js';

export class Application {
  constructor() {
    this.app = express();
    this.configure();
  }

  configure() {
    const allowedOrigins = env.frontendUrl.split(',').map(origin => origin.trim()).filter(Boolean);
    this.app.use(cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) return callback(null, true);
        return callback(new Error('Origen CORS no permitido'));
      }
    }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(passport.initialize());
    this.app.use(limiter);
    this.app.use('/uploads', express.static(path.resolve('uploads')));
    this.app.get('/health', (req, res) => res.json({ status: 'ok' }));
    this.app.use('/api', apiRouter);

    const swaggerPath = path.resolve('swagger.json');
    if (fs.existsSync(swaggerPath)) {
      this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(JSON.parse(fs.readFileSync(swaggerPath, 'utf8'))));
    }
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }
}

export default new Application().app;
