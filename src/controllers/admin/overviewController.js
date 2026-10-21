import {
  Dish,
  Testimonial,
  Faq,
  Media,
  FormSubmission,
  MenuItem,
} from '../../models/index.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

/** GET /api/admin/overview — headline counts for the dashboard. */
export const overview = asyncHandler(async (_req, res) => {
  const [
    salads,
    lunch,
    wraps,
    testimonials,
    faqs,
    media,
    menuItems,
    submissionsTotal,
    submissionsNew,
    recentSubmissions,
  ] = await Promise.all([
    Dish.countDocuments({ deletedAt: null, type: 'salad' }),
    Dish.countDocuments({ deletedAt: null, type: 'lunch' }),
    Dish.countDocuments({ deletedAt: null, type: 'wrap' }),
    Testimonial.countDocuments({ deletedAt: null }),
    Faq.countDocuments({ deletedAt: null }),
    Media.countDocuments({ deletedAt: null }),
    MenuItem.countDocuments({}),
    FormSubmission.countDocuments({ deletedAt: null }),
    FormSubmission.countDocuments({ deletedAt: null, status: 'new' }),
    FormSubmission.find({ deletedAt: null }).sort({ createdAt: -1 }).limit(5),
  ]);

  res.json({
    counts: {
      salads,
      lunch,
      wraps,
      testimonials,
      faqs,
      media,
      menuItems,
      submissions: { total: submissionsTotal, new: submissionsNew },
    },
    recentSubmissions,
  });
});
