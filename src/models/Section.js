import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * A reusable homepage/section block. The structured content for each section
 * (stats, cards, steps, images, etc.) is stored in `content` so the exact shape
 * can vary per section while the public components read known keys.
 */
const sectionSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, index: true }, // "hero", "about", ...
    name: { type: String, required: true, trim: true }, // admin-facing name
    tag: { type: String, default: '' }, // the small "section-tag" label
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    content: { type: Schema.Types.Mixed, default: {} },
    sortOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

sectionSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export const Section = model('Section', sectionSchema);
export default Section;
