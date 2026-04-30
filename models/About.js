import mongoose from 'mongoose';

const EducationSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ['10th', '12th', 'Diploma', 'Bachelor', 'Master', 'PhD'],
      required: true,
    },
    schoolName: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      default: '',
    },
    score: {
      type: String,
      required: true,
    },
  },
  { _id: true },
);

const AboutSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    birthDate: {
      type: Date,
      default: null,
    },
    nationality: {
      type: String,
      default: '',
    },
    education: {
      type: [EducationSchema],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    hobbies: {
      type: [String],
      default: [],
    },
    // Keep old fields for backward compatibility
    languages: {
      type: [String],
      default: [],
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    strict: false, // Allow additional fields for backward compatibility
  },
);

const About = mongoose.models.About || mongoose.model('About', AboutSchema);

export { About };
