import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as publicController from '../controllers/publicController.js';
import { validate } from '../middleware/validate.js';
import { submissionCreateSchema } from '../validators/contentValidators.js';

const router = Router();

// Limit public form submissions to curb spam/abuse.
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions. Please try again later.' },
});

router.get('/bootstrap', publicController.bootstrap);
router.get('/settings', publicController.getSettings);
router.get('/menus/:location', publicController.getMenu);
router.get('/sections', publicController.getSections);
router.get('/pages/:slug', publicController.getPageBySlug);
router.get('/dishes', publicController.getDishes);
router.get('/testimonials', publicController.getTestimonials);
router.get('/faqs', publicController.getFaqs);

router.post(
  '/submissions',
  submitLimiter,
  validate({ body: submissionCreateSchema }),
  publicController.createSubmission
);

export default router;
