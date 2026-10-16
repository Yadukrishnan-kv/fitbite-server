import mongoose from 'mongoose';
import { FormSubmission } from '../../models/index.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { notFound } from '../../utils/httpError.js';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const list = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const filter = { deletedAt: null };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.type) filter.type = req.query.type;
  if (req.query.q) {
    const rx = new RegExp(String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { phone: rx }, { message: rx }];
  }
  const [items, total, unread] = await Promise.all([
    FormSubmission.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    FormSubmission.countDocuments(filter),
    FormSubmission.countDocuments({ deletedAt: null, status: 'new' }),
  ]);
  res.json({ items, total, unread, page, pages: Math.ceil(total / limit) || 1, limit });
});

export const getOne = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) throw notFound('Submission not found');
  const item = await FormSubmission.findOne({ _id: req.params.id, deletedAt: null });
  if (!item) throw notFound('Submission not found');
  // Auto-mark as read the first time it's opened.
  if (item.status === 'new') {
    item.status = 'read';
    await item.save();
  }
  res.json({ item });
});

export const updateStatus = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) throw notFound('Submission not found');
  const item = await FormSubmission.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    { $set: { status: req.body.status } },
    { new: true }
  );
  if (!item) throw notFound('Submission not found');
  res.json({ item });
});

export const remove = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) throw notFound('Submission not found');
  const item = await FormSubmission.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    { $set: { deletedAt: new Date() } },
    { new: true }
  );
  if (!item) throw notFound('Submission not found');
  res.json({ ok: true });
});
