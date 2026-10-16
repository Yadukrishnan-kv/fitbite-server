import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

/**
 * Throttle repeated login attempts per IP to slow brute-force attacks.
 * Successful logins don't count against the limit.
 */
export const loginRateLimiter = rateLimit({
  windowMs: env.loginRate.windowMs,
  max: env.loginRate.max,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts. Please try again later.' },
});

/** A gentler global limiter for the whole API surface. */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

export default loginRateLimiter;
