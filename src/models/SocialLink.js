import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const socialLinkSchema = new Schema(
  {
    platform: { type: String, required: true, trim: true }, // "instagram", "whatsapp", ...
    url: { type: String, required: true, trim: true },
    icon: { type: String, default: '' }, // icon key resolved on the frontend
    sortOrder: { type: Number, default: 0 },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

socialLinkSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export const SocialLink = model('SocialLink', socialLinkSchema);
export default SocialLink;
