import { AdminUser } from '../models/index.js';
import { extractToken, verifyToken } from '../services/tokenService.js';
import { unauthorized, forbidden } from '../utils/httpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Require a valid session. Loads the admin user and attaches it as req.user.
 * Rejects with 401 if the token is missing, invalid, expired, or the user is gone.
 */
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) throw unauthorized('Authentication required');

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw unauthorized('Session expired or invalid. Please log in again.');
  }

  const user = await AdminUser.findById(payload.sub);
  if (!user) throw unauthorized('Account no longer exists');

  req.user = user;
  next();
});

/** Restrict a route to specific roles (used once multiple roles exist). */
export const requireRole =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user) return next(unauthorized());
    if (!roles.includes(req.user.role)) return next(forbidden('Insufficient permissions'));
    return next();
  };

export default requireAuth;
