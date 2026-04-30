import { connectDB } from '@/lib/db';
import { About } from '@/models/About';
import { verifyAuth } from '@/lib/auth-middleware';

export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    let about = await About.findOne();

    // If no document exists, create empty one
    if (!about) {
      about = {
        profileImage: '',
        title: '',
        description: '',
        birthDate: null,
        nationality: '',
        education: [],
        skills: [],
        interests: [],
        hobbies: [],
      };
    } else {
      // Convert mongoose document to plain object
      about = about.toObject();

      // Remove MongoDB internal fields
      delete about._id;
      delete about.__v;
      delete about.createdAt;
      delete about.updatedAt;
    }

    // Ensure all required arrays exist
    about.education = about.education || [];
    about.skills = about.skills || [];
    about.interests = about.interests || [];
    about.hobbies = about.hobbies || [];

    return Response.json(about);
  } catch (error) {
    console.error('GET /api/admin/about error:', error);
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

    console.log('Received data for save:', JSON.stringify(data, null, 2));

    // Find existing document
    let about = await About.findOne();

    if (!about) {
      // Create new document if doesn't exist
      about = new About();
    }

    // Update fields individually to preserve Mongoose schema
    about.profileImage = data.profileImage || '';
    about.title = data.title || '';
    about.description = data.description || '';
    about.birthDate = data.birthDate ? new Date(data.birthDate) : null;
    about.nationality = data.nationality || '';
    about.education = (data.education || []).map((edu) => ({
      level: edu.level,
      schoolName: edu.schoolName,
      department: edu.department || '',
      score: edu.score,
    }));
    about.skills = data.skills || [];
    about.interests = data.interests || [];
    about.hobbies = data.hobbies || [];
    about.updatedAt = new Date();

    // Save the document
    await about.save();

    // Return the saved document without internal fields
    const savedAbout = about.toObject();
    delete savedAbout._id;
    delete savedAbout.__v;
    delete savedAbout.createdAt;
    delete savedAbout.updatedAt;

    return Response.json(savedAbout);
  } catch (error) {
    console.error('PUT /api/admin/about error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  return Response.json({ message: 'Method not allowed' }, { status: 405 });
}

export async function DELETE(req) {
  return Response.json({ message: 'Method not allowed' }, { status: 405 });
}
