import mongoose from 'mongoose';
import { Menu, MenuItem } from '../../models/index.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { notFound, badRequest, conflict } from '../../utils/httpError.js';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/* ---------------- Menus ---------------- */

export const listMenus = asyncHandler(async (_req, res) => {
  const menus = await Menu.find().sort('location');
  res.json({ items: menus });
});

export const getMenu = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) throw notFound('Menu not found');
  const menu = await Menu.findById(req.params.id);
  if (!menu) throw notFound('Menu not found');
  const items = await MenuItem.find({ menu: menu._id }).sort('sortOrder');
  res.json({ item: menu, menuItems: items });
});

export const createMenu = asyncHandler(async (req, res) => {
  const menu = await Menu.create(req.body);
  res.status(201).json({ item: menu });
});

export const updateMenu = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) throw notFound('Menu not found');
  const menu = await Menu.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
  if (!menu) throw notFound('Menu not found');
  res.json({ item: menu });
});

export const deleteMenu = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) throw notFound('Menu not found');
  const menu = await Menu.findByIdAndDelete(req.params.id);
  if (!menu) throw notFound('Menu not found');
  await MenuItem.deleteMany({ menu: menu._id }); // cascade remove its items
  res.json({ ok: true });
});

/* ---------------- Menu items ---------------- */

export const createItem = asyncHandler(async (req, res) => {
  const { menu, parent } = req.body;
  if (!isValidId(menu)) throw badRequest('Invalid menu id');
  if (!(await Menu.exists({ _id: menu }))) throw notFound('Menu not found');

  if (parent) {
    if (!isValidId(parent)) throw badRequest('Invalid parent id');
    const parentDoc = await MenuItem.findById(parent);
    if (!parentDoc) throw notFound('Parent menu item not found');
    // Enforce a single level of nesting (dropdowns), no infinite depth.
    if (parentDoc.parent) throw badRequest('Menu items can only be nested one level deep');
  }

  const item = await MenuItem.create({ ...req.body, parent: parent || null });
  res.status(201).json({ item });
});

export const updateItem = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) throw notFound('Menu item not found');
  const existing = await MenuItem.findById(req.params.id);
  if (!existing) throw notFound('Menu item not found');

  const updates = { ...req.body };
  if (updates.parent) {
    if (!isValidId(updates.parent)) throw badRequest('Invalid parent id');
    if (String(updates.parent) === String(existing._id)) {
      throw badRequest('A menu item cannot be its own parent');
    }
    const parentDoc = await MenuItem.findById(updates.parent);
    if (!parentDoc) throw notFound('Parent menu item not found');
    if (parentDoc.parent) throw badRequest('Menu items can only be nested one level deep');
    // Prevent turning a parent-of-children into a child.
    const hasChildren = await MenuItem.exists({ parent: existing._id });
    if (hasChildren) throw conflict('This item has sub-items; move or remove them first');
  }

  existing.set(updates);
  await existing.save();
  res.json({ item: existing });
});

export const deleteItem = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) throw notFound('Menu item not found');
  const existing = await MenuItem.findById(req.params.id);
  if (!existing) throw notFound('Menu item not found');
  // Remove children along with the parent.
  await MenuItem.deleteMany({ parent: existing._id });
  await existing.deleteOne();
  res.json({ ok: true });
});

// Reorder items (optionally within a parent) by array index.
export const reorderItems = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.some((id) => !isValidId(id))) {
    throw badRequest('`ids` must be an array of valid ids');
  }
  await MenuItem.bulkWrite(
    ids.map((id, index) => ({ updateOne: { filter: { _id: id }, update: { $set: { sortOrder: index } } } }))
  );
  res.json({ ok: true });
});
