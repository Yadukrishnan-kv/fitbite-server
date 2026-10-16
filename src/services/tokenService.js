import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/** Sign a JWT for an admin user id. */
export function signToken(userId) {
  return jwt.sign({ sub: String(userId) }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

/** Verify a JWT and return its payload, or throw. */
export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

/** Cookie attributes shared by set/clear so they always match. */
function baseCookieOptions() {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
    path: '/',
  };
}

/** Attach the auth cookie to a response. */
export function setAuthCookie(res, token) {
  res.cookie(env.cookieName, token, {
    ...baseCookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

/** Remove the auth cookie. */
export function clearAuthCookie(res) {
  res.clearCookie(env.cookieName, baseCookieOptions());
}

/** Pull the raw token from the cookie, falling back to a Bearer header. */
export function extractToken(req) {
  const fromCookie = req.cookies?.[env.cookieName];
  if (fromCookie) return fromCookie;
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return null;
}
