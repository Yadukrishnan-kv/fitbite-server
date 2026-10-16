import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const menuSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    // Where this menu renders on the public site.
    location: {
      type: String,
      enum: ['header', 'footer'],
      required: true,
      index: true,
    },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

menuSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export const Menu = model('Menu', menuSchema);
export default Menu;
