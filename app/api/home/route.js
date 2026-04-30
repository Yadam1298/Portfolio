import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

async function getHomeModel() {
  if (mongoose.models.Home) {
    return mongoose.models.Home;
  }

  const HomeSchema = new mongoose.Schema(
    {
      pictureLink: String,
      fullName: String,
      aspirings: [String],
      description: String,
      resumeLink: String,
      socialLinks: {
        whatsapp: String,
        linkedin: String,
        github: String,
        mailId: String,
      },
      updatedAt: Date,
    },
    { strict: false },
  );

  return mongoose.model('Home', HomeSchema);
}

export async function GET() {
  try {
    await connectDB();
    const Home = await getHomeModel();

    const home = await Home.findOne();

    return Response.json(
      home || {
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
      },
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
