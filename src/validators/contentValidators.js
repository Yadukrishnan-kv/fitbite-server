import { z } from 'zod';

const str = (max = 5000) => z.string().trim().max(max);
const optionalStr = (max = 5000) => z.string().trim().max(max).optional().default('');

export const reorderSchema = z.object({
  ids: z.array(z.string()).min(0),
});

/* ---------------- Pages ---------------- */
export const pageCreateSchema = z.object({
  title: str(200).min(1, 'Title is required'),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug may contain lowercase letters, numbers and hyphens only')
    .max(200)
    .optional(),
  heading: optionalStr(300),
  bodyHtml: z.string().max(200000).optional().default(''),
  featuredImage: optionalStr(1000),
  seoTitle: optionalStr(200),
  metaDescription: optionalStr(320),
  metaKeywords: optionalStr(500),
  status: z.enum(['draft', 'published']).optional().default('draft'),
  sortOrder: z.coerce.number().int().optional().default(0),
});

export const pageUpdateSchema = pageCreateSchema.partial();

/* ---------------- Dishes ---------------- */
export const dishCreateSchema = z.object({
  name: str(200).min(1, 'Name is required'),
  desc: optionalStr(2000),
  price: z.coerce.number().min(0, 'Price must be 0 or more'),
  type: z.enum(['salad', 'lunch', 'wrap']).optional().default('salad'),
  categories: z.array(z.string().trim()).optional().default([]),
  calories: z.coerce.number().min(0).optional().default(0),
  protein: optionalStr(20),
  carbs: optionalStr(20),
  rating: z.coerce.number().min(0).max(5).optional().default(0),
  reviews: z.coerce.number().int().min(0).optional().default(0),
  image: optionalStr(1000),
  isAvailable: z.coerce.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().optional().default(0),
});
export const dishUpdateSchema = dishCreateSchema.partial();

/* ---------------- Testimonials ---------------- */
export const testimonialCreateSchema = z.object({
  name: str(120).min(1, 'Name is required'),
  tag: optionalStr(120),
  text: str(2000).min(1, 'Testimonial text is required'),
  initials: optionalStr(6),
  rating: z.coerce.number().min(0).max(5).optional().default(5),
  isVisible: z.coerce.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().optional().default(0),
});
export const testimonialUpdateSchema = testimonialCreateSchema.partial();

/* ---------------- FAQs ---------------- */
export const faqCreateSchema = z.object({
  question: str(500).min(1, 'Question is required'),
  answer: str(4000).min(1, 'Answer is required'),
  isVisible: z.coerce.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().optional().default(0),
});
export const faqUpdateSchema = faqCreateSchema.partial();

/* ---------------- Sections ---------------- */
export const sectionUpdateSchema = z.object({
  name: optionalStr(120),
  tag: optionalStr(120),
  title: optionalStr(300),
  subtitle: optionalStr(1000),
  content: z.any().optional(),
  isVisible: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

/* ---------------- Social links ---------------- */
export const socialCreateSchema = z.object({
  platform: str(60).min(1, 'Platform is required'),
  url: z.string().trim().url('A valid URL is required').max(1000),
  icon: optionalStr(60),
  isEnabled: z.coerce.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().optional().default(0),
});
export const socialUpdateSchema = socialCreateSchema.partial();

/* ---------------- Menus & items ---------------- */
export const menuCreateSchema = z.object({
  name: str(120).min(1, 'Name is required'),
  location: z.enum(['header', 'footer']),
  description: optionalStr(300),
});
export const menuUpdateSchema = menuCreateSchema.partial();

export const menuItemCreateSchema = z.object({
  menu: z.string().min(1, 'menu id is required'),
  parent: z.string().nullable().optional(),
  label: str(120).min(1, 'Label is required'),
  url: str(500).min(1, 'URL is required'),
  linkType: z.enum(['internal', 'anchor', 'external']).optional().default('internal'),
  target: z.enum(['_self', '_blank']).optional().default('_self'),
  isEnabled: z.coerce.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().optional().default(0),
});
export const menuItemUpdateSchema = menuItemCreateSchema.partial().omit({ menu: true });

/* ---------------- Settings ---------------- */
export const settingsBulkSchema = z.object({
  settings: z
    .array(
      z.object({
        key: z.string().trim().min(1),
        value: z.any(),
      })
    )
    .min(1, 'At least one setting is required'),
});

/* ---------------- Media ---------------- */
export const mediaUpdateSchema = z.object({
  alt: optionalStr(300),
});

/* ---------------- Submissions ---------------- */
export const submissionCreateSchema = z.object({
  name: str(120).min(1, 'Name is required'),
  email: z.string().trim().toLowerCase().email('A valid email is required').optional().or(z.literal('')),
  phone: optionalStr(40),
  message: str(4000).min(1, 'Message is required'),
  // Honeypot: bots fill hidden fields; real users leave it empty.
  website: z.string().max(0, 'Spam detected').optional().or(z.literal('')),
}).refine((d) => d.email || d.phone, {
  message: 'Provide at least an email or a phone number',
  path: ['email'],
});

export const submissionUpdateSchema = z.object({
  status: z.enum(['new', 'read', 'archived']),
});
