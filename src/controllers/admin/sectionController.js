import mongoose from 'mongoose';
import { Section } from '../../models/index.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { notFound, badRequest } from '../../utils/httpError.js';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const list = asyncHandler(async (_req, res) => {
  const items = await Section.find().sort('sortOrder');
  res.json({ items });
});

export const getOne = asyncHandler(async (req, res) => {
  // Accept either an ObjectId or the section key ("hero").
  const query = isValidId(req.params.id) ? { _id: req.params.id } : { key: req.params.id };
  const item = await Section.findOne(query);
  if (!item) throw notFound('Section not found');
  res.json({ item });
});

export const update = asyncHandler(async (req, res) => {
  const query = isValidId(req.params.id) ? { _id: req.params.id } : { key: req.params.id };
  const item = await Section.findOne(query);
  if (!item) throw notFound('Section not found');
  item.set(req.body);
  await item.save();
  res.json({ item });
});

export const reorder = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.some((id) => !isValidId(id))) {
    throw badRequest('`ids` must be an array of valid ids');
  }
  await Section.bulkWrite(
    ids.map((id, index) => ({ updateOne: { filter: { _id: id }, update: { $set: { sortOrder: index } } } }))
  );
  res.json({ ok: true });
});
