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

const app = express();

const allowedOrigins = env.frontendUrl.split(',').map(origin => origin.trim()).filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) return callback(null, true);
    return callback(new Error('Origen CORS no permitido'));
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(limiter);
app.use('/uploads', express.static(path.resolve('uploads')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', apiRouter);

const swaggerPath = path.resolve('swagger.json');
if (fs.existsSync(swaggerPath)) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(JSON.parse(fs.readFileSync(swaggerPath, 'utf8'))));
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
