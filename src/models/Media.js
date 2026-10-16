import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const mediaSchema = new Schema(
  {
    filename: { type: String, required: true }, // stored (safe, randomized) name
    originalName: { type: String, default: '' }, // name the user uploaded
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, default: 0 },
    // Public URL path used by the frontend, e.g. "/uploads/ab12cd34.jpg".
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    width: { type: Number, default: null },
    height: { type: Number, default: null },

    // Optional bookkeeping of where this media is referenced, so the admin
    // can warn before deleting a file that is still in use.
    usageCount: { type: Number, default: 0 },

    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

mediaSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export const Media = model('Media', mediaSchema);
export default Media;
