import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const faqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true, index: true },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

faqSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export const Faq = model('Faq', faqSchema);
export default Faq;
