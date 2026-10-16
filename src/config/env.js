import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load the .env that lives at the server root (../../ from src/config).
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const bool = (v, fallback = false) =>
  v === undefined ? fallback : ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase());

const num = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: (process.env.NODE_ENV || 'development') === 'production',
  port: num(process.env.PORT, 5000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',

  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitbite',

  jwtSecret: process.env.JWT_SECRET || 'dev-insecure-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieName: process.env.COOKIE_NAME || 'fitbite_token',
  // 'lax' works when the admin UI is served from the same site as the API
  // (the recommended deployment). Set COOKIE_SAMESITE=none + COOKIE_SECURE=true
  // if the admin panel lives on a different domain than the API.
  cookieSameSite: process.env.COOKIE_SAMESITE || 'lax',
  cookieSecure: bool(process.env.COOKIE_SECURE, (process.env.NODE_ENV || 'development') === 'production'),

  admin: {
    name: process.env.ADMIN_NAME || 'Fitbite Admin',
    email: (process.env.ADMIN_EMAIL || 'admin@fitbite.in').toLowerCase(),
    password: process.env.ADMIN_PASSWORD || '',
  },

  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxUploadBytes: num(process.env.MAX_UPLOAD_MB, 5) * 1024 * 1024,

  loginRate: {
    windowMs: num(process.env.LOGIN_RATE_WINDOW_MINUTES, 15) * 60 * 1000,
    max: num(process.env.LOGIN_RATE_MAX_ATTEMPTS, 8),
  },

  featureFlags: {
    verboseHttpLog: bool(process.env.VERBOSE_HTTP_LOG, false),
  },
};

/**
 * Fail fast in production if critical secrets are missing or left at defaults.
 * In development we allow insecure defaults so the app can boot with zero config.
 */
export function assertProductionEnv() {
  if (!env.isProd) return;
  const problems = [];
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'change-me-to-a-long-random-string') {
    problems.push('JWT_SECRET must be set to a strong random value in production.');
  }
  if (!process.env.MONGODB_URI) {
    problems.push('MONGODB_URI must be set in production.');
  }
  if (problems.length) {
    // eslint-disable-next-line no-console
    console.error('\nFATAL: invalid production configuration:\n - ' + problems.join('\n - ') + '\n');
    process.exit(1);
  }
}

export default env;
