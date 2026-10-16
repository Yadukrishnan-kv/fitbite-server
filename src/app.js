import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env.js';
import { apiRateLimiter } from './middleware/rateLimit.js';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  // Behind a proxy (Render/Nginx) so secure cookies + rate-limit IPs work.
  app.set('trust proxy', 1);

  // Security headers. crossOriginResourcePolicy relaxed so the separate
  // client origin can load uploaded images during local development.
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS restricted to the known client origin, with credentials for cookies.
  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: true,
    })
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  if (!env.isProd || env.featureFlags.verboseHttpLog) {
    app.use(morgan('dev'));
  }

  // Serve uploaded media as static files.
  const uploadsPath = path.resolve(__dirname, '..', env.uploadDir);
  app.use('/uploads', express.static(uploadsPath, { maxAge: '7d', index: false }));

  // Health check.
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'fitbite-server', env: env.nodeEnv, time: new Date().toISOString() });
  });

  // Gentle global limiter across the whole API.
  app.use('/api', apiRateLimiter);

  // ---- API routers ----
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api', publicRoutes);

  // 404 for unknown API routes.
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Central error handler.
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    if (status >= 500) {
      // eslint-disable-next-line no-console
      console.error('[error]', err);
    }
    res.status(status).json({
      error: err.publicMessage || err.message || 'Internal Server Error',
      ...(err.details ? { details: err.details } : {}),
    });
  });

  return app;
}

export default createApp;
