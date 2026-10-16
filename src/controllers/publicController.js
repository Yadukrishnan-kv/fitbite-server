import {
  Page,
  Menu,
  MenuItem,
  SiteSetting,
  SocialLink,
  Section,
  Dish,
  Testimonial,
  Faq,
  FormSubmission,
} from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notFound } from '../utils/httpError.js';

/** Build a nested tree from a flat list of enabled menu items. */
function buildMenuTree(items) {
  const byId = new Map();
  const roots = [];
  items.forEach((it) => byId.set(String(it._id), { ...it.toJSON(), children: [] }));
  items.forEach((it) => {
    const node = byId.get(String(it._id));
    const parentId = it.parent ? String(it.parent) : null;
    if (parentId && byId.has(parentId)) {
      byId.get(parentId).children.push(node);
    } else {
      roots.push(node);
    }
  });
  const sortRec = (nodes) => {
    nodes.sort((a, b) => a.sortOrder - b.sortOrder);
    nodes.forEach((n) => sortRec(n.children));
  };
  sortRec(roots);
  return roots;
}

async function menuTreeByLocation(location) {
  const menu = await Menu.findOne({ location });
  if (!menu) return [];
  const items = await MenuItem.find({ menu: menu._id, isEnabled: true });
  return buildMenuTree(items);
}

function settingsToMap(docs) {
  return docs.reduce((acc, d) => {
    acc[d.key] = d.value;
    return acc;
  }, {});
}

/**
 * GET /api/bootstrap
 * One call returning everything the layout needs: settings, socials, and menus.
 */
export const bootstrap = asyncHandler(async (_req, res) => {
  const [settings, socials, header, footer] = await Promise.all([
    SiteSetting.find().sort('sortOrder'),
    SocialLink.find({ isEnabled: true }).sort('sortOrder'),
    menuTreeByLocation('header'),
    menuTreeByLocation('footer'),
  ]);
  res.json({
    settings: settingsToMap(settings),
    socialLinks: socials,
    menus: { header, footer },
  });
});

export const getSettings = asyncHandler(async (_req, res) => {
  const settings = await SiteSetting.find().sort('sortOrder');
  res.json({ settings: settingsToMap(settings) });
});

export const getMenu = asyncHandler(async (req, res) => {
  const tree = await menuTreeByLocation(req.params.location);
  res.json({ items: tree });
});

export const getSections = asyncHandler(async (_req, res) => {
  const sections = await Section.find({ isVisible: true }).sort('sortOrder');
  // Return keyed map for easy lookup plus ordered array.
  const map = sections.reduce((acc, s) => {
    acc[s.key] = s.toJSON();
    return acc;
  }, {});
  res.json({ sections: sections.map((s) => s.toJSON()), byKey: map });
});

export const getPageBySlug = asyncHandler(async (req, res) => {
  const page = await Page.findOne({ slug: req.params.slug, status: 'published', deletedAt: null });
  if (!page) throw notFound('Page not found');
  res.json({ item: page });
});

const DISH_TYPES = ['salad', 'lunch', 'wrap'];

export const getDishes = asyncHandler(async (req, res) => {
  const type = DISH_TYPES.includes(req.query.type) ? req.query.type : 'salad';
  const filter = { deletedAt: null, isAvailable: true, type };
  if (req.query.category && req.query.category !== 'all') {
    filter.categories = req.query.category;
  }
  const dishes = await Dish.find(filter).sort('sortOrder');
  res.json({ items: dishes });
});

export const getTestimonials = asyncHandler(async (_req, res) => {
  const items = await Testimonial.find({ deletedAt: null, isVisible: true }).sort('sortOrder');
  res.json({ items });
});

export const getFaqs = asyncHandler(async (_req, res) => {
  const items = await Faq.find({ deletedAt: null, isVisible: true }).sort('sortOrder');
  res.json({ items });
});

/**
 * POST /api/submissions
 * Public enquiry form. Honeypot + validation happen in middleware; here we
 * just persist and capture request metadata for spam triage.
 */
export const createSubmission = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;
  await FormSubmission.create({
    type: 'enquiry',
    name,
    email: email || '',
    phone: phone || '',
    message,
    ip: req.ip,
    userAgent: req.headers['user-agent'] || '',
  });
  res.status(201).json({ ok: true, message: 'Thanks! We’ll get back to you shortly.' });
});
