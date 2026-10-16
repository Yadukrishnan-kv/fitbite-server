import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { loginRateLimiter } from '../middleware/rateLimit.js';
import {
  loginSchema,
  changePasswordSchema,
  updateProfileSchema,
} from '../validators/authValidators.js';

const router = Router();

// Public
router.post('/login', loginRateLimiter, validate({ body: loginSchema }), authController.login);
router.post('/logout', authController.logout);

// Protected (require a valid session)
router.get('/me', requireAuth, authController.me);
router.patch('/profile', requireAuth, validate({ body: updateProfileSchema }), authController.updateProfile);
router.post(
  '/change-password',
  requireAuth,
  validate({ body: changePasswordSchema }),
  authController.changePassword
);

export default router;
