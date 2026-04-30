import { connectDB } from '@/lib/db';
import { About } from '@/models/About';

export async function GET() {
  try {
    await connectDB();

    let about = await About.findOne();

    // If no data exists, return safe empty structure
    if (!about) {
      return Response.json({
        profileImage: '',
        title: '',
        description: '',
        birthDate: null,
        nationality: '',
        education: [],
        skills: [],
        interests: [],
        hobbies: [],
      });
    }

    // Convert mongoose document to plain object
    about = about.toObject();

    // Remove sensitive/internal fields
    delete about._id;
    delete about.__v;
    delete about.createdAt;
    delete about.updatedAt;

    // Ensure arrays exist (safe frontend handling)
    about.education = about.education || [];
    about.skills = about.skills || [];
    about.interests = about.interests || [];
    about.hobbies = about.hobbies || [];

    return Response.json(about);
  } catch (error) {
    console.error('GET /api/about error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
