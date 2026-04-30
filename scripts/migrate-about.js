// scripts/migrate-about.js

const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env.local'),
});

const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema(
  {
    profileImage: String,
    title: String,
    description: String,
    birthDate: Date,
    nationality: String,
    education: [
      {
        level: String,
        schoolName: String,
        department: String,
        score: String,
      },
    ],
    skills: [String],
    interests: [String],
    hobbies: [String],
    languages: [String],
    updatedAt: Date,
  },
  { timestamps: true },
);

const About = mongoose.models.About || mongoose.model('About', AboutSchema);

async function migrate() {
  try {
    console.log('ENV URI:', process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const about = await About.findOne();

    if (about) {
      let needsUpdate = false;
      const updates = {};

      // Initialize missing arrays
      if (!about.education) {
        updates.education = [];
        needsUpdate = true;
      }

      if (!about.skills) {
        updates.skills = [];
        needsUpdate = true;
      }

      if (!about.hobbies) {
        updates.hobbies = [];
        needsUpdate = true;
      }

      if (!about.languages) {
        updates.languages = [];
        needsUpdate = true;
      }

      if (!about.interests) {
        updates.interests = [];
        needsUpdate = true;
      }

      // Optional: Fix common typos in interests
      if (Array.isArray(about.interests)) {
        updates.interests = about.interests.map((item) => {
          if (item === 'AI/ML Practionar') return 'AI/ML Practitioner';
          if (item === 'Software Develpment Engineer')
            return 'Software Development Engineer';
          return item;
        });
        needsUpdate = true;
      }

      if (needsUpdate) {
        const result = await About.findOneAndUpdate(
          { _id: about._id },
          { $set: updates },
          { returnDocument: 'after' },
        );

        console.log('Migration successful!');
        console.log('Updated fields:', Object.keys(updates));
        console.log(result);
      } else {
        console.log('No migration needed');
      }
    } else {
      console.log('No about document found');
    }

    await mongoose.disconnect();
    console.log('Migration completed');
  } catch (error) {
    console.error('Migration error:', error);
  }
}

migrate();
