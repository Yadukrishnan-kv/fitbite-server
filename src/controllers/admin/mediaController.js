import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import { Media, Dish, SiteSetting } from '../../models/index.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { notFound, badRequest, conflict } from '../../utils/httpError.js';
import { uploadsDir, hasValidImageSignature } from '../../middleware/upload.js';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const list = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 30));
  const filter = { deletedAt: null };
  if (req.query.q) {
    const rx = new RegExp(String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ originalName: rx }, { alt: rx }];
  }
  const [items, total] = await Promise.all([
    Media.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Media.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) || 1, limit });
});

/**
 * POST /api/admin/media  (multipart, field "file")
 * Validates the real file signature (not just the client mime type) before
 * recording it, deleting anything that fails the check.
 */
export const upload = asyncHandler(async (req, res) => {
  if (!req.file) throw badRequest('No file uploaded (expected form field "file")');

  const filePath = path.join(uploadsDir, req.file.filename);

  if (!hasValidImageSignature(filePath)) {
    fs.unlink(filePath, () => {});
    throw badRequest('File content is not a valid image');
  }

  const media = await Media.create({
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    sizeBytes: req.file.size,
    url: `/uploads/${req.file.filename}`,
    alt: req.body.alt || '',
  });

  res.status(201).json({ item: media });
});

export const update = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) throw notFound('Media not found');
  const media = await Media.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    { $set: { alt: req.body.alt ?? '' } },
    { new: true }
  );
  if (!media) throw notFound('Media not found');
  res.json({ item: media });
});

/** Find places the media URL is referenced, to warn before deletion. */
async function findUsage(url) {
  const [dishes, settings] = await Promise.all([
    Dish.countDocuments({ image: url, deletedAt: null }),
    SiteSetting.countDocuments({ value: url }),
  ]);
  return dishes + settings;
}

/**
 * DELETE /api/admin/media/:id
 * Blocks deletion of in-use media unless ?force=true is passed.
 * Removes the file from disk and soft-deletes the record.
 */
export const remove = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) throw notFound('Media not found');
  const media = await Media.findOne({ _id: req.params.id, deletedAt: null });
  if (!media) throw notFound('Media not found');

  const usage = await findUsage(media.url);
  const force = req.query.force === 'true';
  if (usage > 0 && !force) {
    throw conflict(`This image is used in ${usage} place(s). Re-send with ?force=true to delete anyway.`, {
      usage,
    });
  }

  const filePath = path.join(uploadsDir, media.filename);
  fs.unlink(filePath, () => {}); // best-effort; ignore missing file
  media.deletedAt = new Date();
  await media.save();

  res.json({ ok: true, usage });
});
