import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    projectTitle: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    gitrepoLink: {
      type: String,
      trim: true,
    },
    abstractLink: {
      type: String,
      trim: true,
    },
    liveDemoVideoLink: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
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

export default mongoose.models.Project ||
  mongoose.model('Project', ProjectSchema);
