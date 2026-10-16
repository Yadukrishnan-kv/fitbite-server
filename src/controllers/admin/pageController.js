import { Page } from '../../models/index.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { notFound, conflict, forbidden, badRequest } from '../../utils/httpError.js';
import { toSlug, uniqueSlug } from '../../utils/slug.js';
import { sanitizeRichText } from '../../services/sanitize.js';
import mongoose from 'mongoose';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

async function ensureUniqueSlug(desired, excludeId) {
  return uniqueSlug(desired, async (candidate) => {
    const exists = await Page.exists({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });
    return Boolean(exists);
  });
}

export const list = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const filter = { deletedAt: null };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.q) {
    const rx = new RegExp(String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ title: rx }, { slug: rx }, { heading: rx }];
  }
  const [items, total] = await Promise.all([
    Page.find(filter).sort({ sortOrder: 1, createdAt: 1 }).skip((page - 1) * limit).limit(limit),
    Page.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) || 1, limit });
});

export const getOne = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) throw notFound('Page not found');
  const item = await Page.findOne({ _id: req.params.id, deletedAt: null });
  if (!item) throw notFound('Page not found');
  res.json({ item });
});

export const create = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  data.slug = await ensureUniqueSlug(data.slug || data.title);
  if (data.bodyHtml) data.bodyHtml = sanitizeRichText(data.bodyHtml);
  const item = await Page.create(data);
  res.status(201).json({ item });
});

export const update = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) throw notFound('Page not found');
  const existing = await Page.findOne({ _id: req.params.id, deletedAt: null });
  if (!existing) throw notFound('Page not found');

  const updates = { ...req.body };

  // System pages (home, dishes) keep their slug so routes stay stable.
  if (existing.isSystem && updates.slug && updates.slug !== existing.slug) {
    throw forbidden('The slug of a system page cannot be changed');
  }
  if (updates.slug && updates.slug !== existing.slug) {
    updates.slug = await ensureUniqueSlug(updates.slug, existing._id);
  }
  if (updates.bodyHtml !== undefined) {
    updates.bodyHtml = sanitizeRichText(updates.bodyHtml);
  }

  existing.set(updates);
  await existing.save();
  res.json({ item: existing });
});

export const remove = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) throw notFound('Page not found');
  const existing = await Page.findOne({ _id: req.params.id, deletedAt: null });
  if (!existing) throw notFound('Page not found');
  if (existing.isSystem) throw forbidden('System pages cannot be deleted');
  existing.deletedAt = new Date();
  await existing.save();
  res.json({ ok: true });
});

export const setStatus = (status) =>
  asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) throw notFound('Page not found');
    const item = await Page.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { $set: { status } },
      { new: true }
    );
    if (!item) throw notFound('Page not found');
    res.json({ item });
  });

export const reorder = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.some((id) => !isValidId(id))) {
    throw badRequest('`ids` must be an array of valid ids');
  }
  await Page.bulkWrite(
    ids.map((id, index) => ({ updateOne: { filter: { _id: id }, update: { $set: { sortOrder: index } } } }))
  );
  res.json({ ok: true });
});

// Duplicate slug is also enforced by the unique index; surface a clean 409 if it slips through.
export const handleDuplicateSlug = (err, _req, _res, next) => {
  if (err && err.code === 11000 && err.keyPattern?.slug) {
    return next(conflict('A page with that slug already exists'));
  }
  return next(err);
};
