// models/Home.js
import mongoose from 'mongoose';

const HomeSchema = new mongoose.Schema(
  {
    pictureLink: { type: String, default: '' },
    fullName: { type: String, default: '' },
    aspirings: { type: [String], default: [] },
    description: { type: string, default: [] },
    resumeLink: { type: String, default: '' },
    socialLinks: {
      whatsapp: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      mailId: { type: String, default: '' },
    },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    // Disable strict mode and minimize to ensure all fields are saved
    strict: false,
    minimize: false,
  },
);

// Remove any existing model to ensure fresh schema
export default mongoose.models.Home || mongoose.model('Home', HomeSchema);
