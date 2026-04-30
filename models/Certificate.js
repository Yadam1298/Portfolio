import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String, // Changed to String for format like "June 2023"
      required: true,
    },
    certificateLink: {
      type: String,
      trim: true,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Certificate ||
  mongoose.model('Certificate', CertificateSchema);
