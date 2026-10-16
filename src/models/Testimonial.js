import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    tag: { type: String, default: '' }, // "Regular Customer", "Gym Partner"
    text: { type: String, required: true },
    initials: { type: String, default: '' },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    sortOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true, index: true },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

testimonialSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export const Testimonial = model('Testimonial', testimonialSchema);
export default Testimonial;
