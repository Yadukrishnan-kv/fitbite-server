import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const pageSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    heading: { type: String, trim: true, default: '' },
    bodyHtml: { type: String, default: '' }, // sanitized rich-text HTML
    featuredImage: { type: String, default: '' }, // media URL/path

    seoTitle: { type: String, trim: true, default: '' },
    metaDescription: { type: String, trim: true, default: '', maxlength: 320 },
    metaKeywords: { type: String, trim: true, default: '' },

    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    sortOrder: { type: Number, default: 0 },

    // Marks system pages (home, dishes) that map to hard-coded routes and
    // should not be deletable from the admin.
    isSystem: { type: Boolean, default: false },

    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

pageSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export const Page = model('Page', pageSchema);
export default Page;
