import { AdminUser } from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { unauthorized, conflict, badRequest } from '../utils/httpError.js';
import {
  signToken,
  setAuthCookie,
  clearAuthCookie,
} from '../services/tokenService.js';

/**
 * POST /api/auth/login
 * Verifies credentials, issues an httpOnly cookie, and returns the user.
 * Errors are intentionally generic to avoid revealing whether an email exists.
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await AdminUser.findOne({ email }).select('+passwordHash');
  const ok = user ? await user.comparePassword(password) : false;
  if (!user || !ok) {
    throw unauthorized('Invalid email or password');
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken(user._id);
  setAuthCookie(res, token);

  res.json({ user: user.toJSON() });
});

/**
 * POST /api/auth/logout
 * Clears the auth cookie. Idempotent.
 */
export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

/**
 * GET /api/auth/me
 * Returns the currently authenticated admin (requireAuth attaches req.user).
 */
export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toJSON() });
});

/**
 * PATCH /api/auth/profile
 * Update the logged-in admin's name/email.
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (email !== req.user.email) {
    const taken = await AdminUser.findOne({ email, _id: { $ne: req.user._id } });
    if (taken) throw conflict('That email is already in use');
  }

  req.user.name = name;
  req.user.email = email;
  await req.user.save();

  res.json({ user: req.user.toJSON() });
});

/**
 * POST /api/auth/change-password
 * Verifies the current password, sets a new hashed one, and rotates the session.
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await AdminUser.findById(req.user._id).select('+passwordHash');
  if (!user) throw unauthorized();

  const ok = await user.comparePassword(currentPassword);
  if (!ok) throw badRequest('Current password is incorrect');

  user.passwordHash = await AdminUser.hashPassword(newPassword);
  await user.save();

  // Rotate the token so the new session reflects the credential change.
  const token = signToken(user._id);
  setAuthCookie(res, token);

  res.json({ ok: true });
});
