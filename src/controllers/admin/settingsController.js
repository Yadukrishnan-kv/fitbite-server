import { SiteSetting } from '../../models/index.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const list = asyncHandler(async (_req, res) => {
  const items = await SiteSetting.find().sort({ group: 1, sortOrder: 1 });
  res.json({ items });
});

/**
 * PATCH /api/admin/settings
 * Bulk update of { key, value } pairs. Only updates existing keys; unknown keys
 * are ignored so the settings surface stays controlled by the seed definition.
 */
export const bulkUpdate = asyncHandler(async (req, res) => {
  const { settings } = req.body;
  const ops = settings.map((s) => ({
    updateOne: { filter: { key: s.key }, update: { $set: { value: s.value } } },
  }));
  if (ops.length) await SiteSetting.bulkWrite(ops);
  const items = await SiteSetting.find().sort({ group: 1, sortOrder: 1 });
  res.json({ items });
});
