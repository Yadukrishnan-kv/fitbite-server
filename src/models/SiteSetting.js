import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * Flexible key/value store for global site configuration
 * (contact info, site title, logo, etc.).
 */
const siteSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, index: true },
    value: { type: Schema.Types.Mixed, default: '' },
    type: {
      type: String,
      enum: ['text', 'textarea', 'email', 'phone', 'url', 'image', 'number', 'boolean', 'json'],
      default: 'text',
    },
    label: { type: String, default: '' }, // human-friendly label for the admin form
    group: { type: String, default: 'general' }, // grouping in the settings UI
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

siteSettingSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export const SiteSetting = model('SiteSetting', siteSettingSchema);
export default SiteSetting;
