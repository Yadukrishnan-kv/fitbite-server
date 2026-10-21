import {
  Page,
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
    pagesTotal,
    pagesPublished,
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
    Page.countDocuments({ deletedAt: null }),
    Page.countDocuments({ deletedAt: null, status: 'published' }),
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
      pages: { total: pagesTotal, published: pagesPublished },
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
