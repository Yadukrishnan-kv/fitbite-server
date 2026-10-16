import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const dishSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    desc: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },

    // Which menu this item belongs to on the public site (Salads / Lunch / Wraps).
    type: { type: String, enum: ['salad', 'lunch', 'wrap'], default: 'salad', index: true },

    // Space-separated categories in the original data ("veg high-protein").
    // Stored as an array here for clean filtering.
    categories: { type: [String], default: [], index: true },

    calories: { type: Number, default: 0 },
    protein: { type: String, default: '' }, // kept as "38g" to match the design
    carbs: { type: String, default: '' },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },

    image: { type: String, default: '' }, // URL/path (local or external)

    isAvailable: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },

    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

dishSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export const Dish = model('Dish', dishSchema);
export default Dish;
