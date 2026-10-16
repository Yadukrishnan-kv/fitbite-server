import mongoose from 'mongoose';
import { asyncHandler } from './asyncHandler.js';
import { notFound, badRequest } from './httpError.js';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Generate standard admin CRUD handlers for a Mongoose model.
 *
 * options:
 *   softDelete       - if true, DELETE sets deletedAt instead of removing
 *   searchableFields - fields matched (case-insensitive) by ?q=
 *   allowedSort      - whitelist of sortable fields (default ['sortOrder','createdAt'])
 *   defaultSort      - default sort spec (default { sortOrder: 1, createdAt: 1 })
 *   filterFields     - query params that map directly to equality filters
 *   transformCreate  - async (body, req) => docData
 *   transformUpdate  - async (body, req, existing) => updates
 */
export function crudFactory(Model, options = {}) {
  const {
    softDelete = false,
    searchableFields = [],
    allowedSort = ['sortOrder', 'createdAt', 'updatedAt'],
    defaultSort = { sortOrder: 1, createdAt: 1 },
    filterFields = [],
    transformCreate = async (body) => body,
    transformUpdate = async (body) => body,
  } = options;

  const baseFilter = () => (softDelete ? { deletedAt: null } : {});

  const list = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const filter = baseFilter();

    if (req.query.q && searchableFields.length) {
      const rx = new RegExp(escapeRegex(String(req.query.q)), 'i');
      filter.$or = searchableFields.map((f) => ({ [f]: rx }));
    }

    for (const f of filterFields) {
      if (req.query[f] !== undefined && req.query[f] !== '') {
        filter[f] = req.query[f];
      }
    }

    let sort = defaultSort;
    if (req.query.sort && allowedSort.includes(req.query.sort)) {
      sort = { [req.query.sort]: req.query.order === 'desc' ? -1 : 1 };
    }

    const [items, total] = await Promise.all([
      Model.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
      Model.countDocuments(filter),
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) || 1, limit });
  });

  const getOne = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) throw notFound(`${Model.modelName} not found`);
    const doc = await Model.findOne({ _id: req.params.id, ...baseFilter() });
    if (!doc) throw notFound(`${Model.modelName} not found`);
    res.json({ item: doc });
  });

  const create = asyncHandler(async (req, res) => {
    const data = await transformCreate(req.body, req);
    const doc = await Model.create(data);
    res.status(201).json({ item: doc });
  });

  const update = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) throw notFound(`${Model.modelName} not found`);
    const existing = await Model.findOne({ _id: req.params.id, ...baseFilter() });
    if (!existing) throw notFound(`${Model.modelName} not found`);
    const updates = await transformUpdate(req.body, req, existing);
    existing.set(updates);
    await existing.save();
    res.json({ item: existing });
  });

  const remove = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) throw notFound(`${Model.modelName} not found`);
    if (softDelete) {
      const doc = await Model.findOneAndUpdate(
        { _id: req.params.id, deletedAt: null },
        { $set: { deletedAt: new Date() } },
        { new: true }
      );
      if (!doc) throw notFound(`${Model.modelName} not found`);
    } else {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) throw notFound(`${Model.modelName} not found`);
    }
    res.json({ ok: true });
  });

  // POST /reorder  { ids: [id1, id2, ...] } -> sets sortOrder to array index.
  const reorder = asyncHandler(async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.some((id) => !isValidId(id))) {
      throw badRequest('`ids` must be an array of valid ids');
    }
    const ops = ids.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { $set: { sortOrder: index } } },
    }));
    if (ops.length) await Model.bulkWrite(ops);
    res.json({ ok: true });
  });

  return { list, getOne, create, update, remove, reorder };
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default crudFactory;
