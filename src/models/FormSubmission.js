import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const formSubmissionSchema = new Schema(
  {
    type: { type: String, enum: ['enquiry', 'contact', 'order'], default: 'enquiry', index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, trim: true, lowercase: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    message: { type: String, default: '' },
    meta: { type: Schema.Types.Mixed, default: {} }, // any extra fields

    status: { type: String, enum: ['new', 'read', 'archived'], default: 'new', index: true },

    // Captured for spam triage; not shown publicly.
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },

    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

formSubmissionSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export const FormSubmission = model('FormSubmission', formSubmissionSchema);
export default FormSubmission;
