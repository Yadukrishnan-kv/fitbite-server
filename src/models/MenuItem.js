import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * A single navigation entry. Self-referencing via `parent` to support
 * dropdowns / nested menus. Belongs to exactly one Menu.
 */
const menuItemSchema = new Schema(
  {
    menu: { type: Schema.Types.ObjectId, ref: 'Menu', required: true, index: true },
    parent: { type: Schema.Types.ObjectId, ref: 'MenuItem', default: null, index: true },

    label: { type: String, required: true, trim: true, maxlength: 120 },
    url: { type: String, required: true, trim: true, maxlength: 500 },

    // internal = react-router path ("/dishes"), anchor = same-page scroll ("#faq"),
    // external = absolute URL ("https://...").
    linkType: {
      type: String,
      enum: ['internal', 'anchor', 'external'],
      default: 'internal',
    },
    target: { type: String, enum: ['_self', '_blank'], default: '_self' },

    sortOrder: { type: Number, default: 0 },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

menuItemSchema.index({ menu: 1, parent: 1, sortOrder: 1 });

menuItemSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export const MenuItem = model('MenuItem', menuItemSchema);
export default MenuItem;
