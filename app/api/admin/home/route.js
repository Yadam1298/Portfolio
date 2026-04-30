// app/api/admin/home/route.js (Complete working version)
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import { verifyAuth } from '@/lib/auth-middleware';

// Import model dynamically to ensure fresh schema
async function getHomeModel() {
  // Clear existing model if it exists
  if (mongoose.models.Home) {
    delete mongoose.models.Home;
  }

  const HomeSchema = new mongoose.Schema(
    {
      pictureLink: { type: String, default: '' },
      fullName: { type: String, default: '' },
      aspirings: { type: [String], default: [] },
      description: { type: String, default: '' },
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
      strict: false,
      minimize: false,
    },
  );

  return mongoose.models.Home || mongoose.model('Home', HomeSchema);
}

export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const Home = await getHomeModel();
    let home = await Home.findOne();

    if (!home) {
      return Response.json({
        pictureLink: '',
        fullName: '',
        aspirings: [],
        description: '',
        resumeLink: '',
        socialLinks: {
          whatsapp: '',
          linkedin: '',
          github: '',
          mailId: '',
        },
      });
    }

    return Response.json(home);
  } catch (error) {
    console.error('GET /api/admin/home error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();

    console.log('=== SAVING HOME DATA ===');

    // Delete all existing documents
    const Home = await getHomeModel();
    await Home.deleteMany({});

    // Create new document with fresh data
    const newHome = new Home({
      pictureLink: data.pictureLink || '',
      fullName: data.fullName || '',
      aspirings: Array.isArray(data.aspirings) ? data.aspirings : [],
      description: data.description || '',
      resumeLink: data.resumeLink || '',
      socialLinks: {
        whatsapp: data.socialLinks?.whatsapp || '',
        linkedin: data.socialLinks?.linkedin || '',
        github: data.socialLinks?.github || '',
        mailId: data.socialLinks?.mailId || '',
      },
      updatedAt: new Date(),
    });

    const savedHome = await newHome.save();

    console.log('Saved successfully:', savedHome._id);
    console.log('Fields saved:', Object.keys(savedHome.toObject()));

    return Response.json(savedHome);
  } catch (error) {
    console.error('PUT /api/admin/home error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
