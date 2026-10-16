import { Dish, Testimonial, Faq, SocialLink } from '../../models/index.js';
import { crudFactory } from '../../utils/crudFactory.js';
import { toSlug, uniqueSlug } from '../../utils/slug.js';

/** Ensure a dish gets a unique slug derived from its name. */
async function dishSlug(name, excludeId) {
  return uniqueSlug(name, async (candidate) => {
    const exists = await Dish.exists({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });
    return Boolean(exists);
  });
}

export const dishController = crudFactory(Dish, {
  softDelete: true,
  searchableFields: ['name', 'desc'],
  filterFields: ['isAvailable', 'type'],
  allowedSort: ['sortOrder', 'name', 'price', 'createdAt', 'rating'],
  transformCreate: async (body) => ({ ...body, slug: await dishSlug(body.name) }),
  transformUpdate: async (body, _req, existing) => {
    const updates = { ...body };
    if (body.name && toSlug(body.name) !== existing.slug.replace(/-\d+$/, '')) {
      updates.slug = await dishSlug(body.name, existing._id);
    }
    return updates;
  },
});

export const testimonialController = crudFactory(Testimonial, {
  softDelete: true,
  searchableFields: ['name', 'text', 'tag'],
  filterFields: ['isVisible'],
  allowedSort: ['sortOrder', 'name', 'createdAt'],
});

export const faqController = crudFactory(Faq, {
  softDelete: true,
  searchableFields: ['question', 'answer'],
  filterFields: ['isVisible'],
  allowedSort: ['sortOrder', 'createdAt'],
});

export const socialController = crudFactory(SocialLink, {
  softDelete: false,
  searchableFields: ['platform'],
  filterFields: ['isEnabled'],
  allowedSort: ['sortOrder', 'platform'],
});
