// app/api/admin/internships/route.js
import { connectDB } from '@/lib/db';
import Internship from '@/models/Internship';
import { verifyAuth } from '@/lib/auth-middleware';

export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const internships = await Internship.find().sort({
      order: 1,
      createdAt: -1,
    });
    return Response.json(internships);
  } catch (error) {
    console.error('GET /api/admin/internships error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();

    // Get the highest order number
    const lastInternship = await Internship.findOne().sort({ order: -1 });
    const newOrder = lastInternship ? lastInternship.order + 1 : 0;

    const internship = await Internship.create({
      company: data.company,
      role: data.role,
      duration: data.duration,
      description: data.description,
      technologies: data.technologies || [],
      certificateLink: data.certificateLink || '',
      companyLogoUrl: data.companyLogoUrl || '',
      featured: data.featured || false,
      order: newOrder,
    });

    return Response.json(internship, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/internships error:', error);
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
    const { id, ...data } = await req.json();

    const internship = await Internship.findByIdAndUpdate(
      id,
      {
        company: data.company,
        role: data.role,
        duration: data.duration,
        description: data.description,
        technologies: data.technologies || [],
        certificateLink: data.certificateLink || '',
        companyLogoUrl: data.companyLogoUrl || '',
        featured: data.featured || false,
      },
      { new: true, runValidators: true },
    );

    if (!internship) {
      return Response.json({ error: 'Internship not found' }, { status: 404 });
    }

    return Response.json(internship);
  } catch (error) {
    console.error('PUT /api/admin/internships error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { error: 'Internship ID required' },
        { status: 400 },
      );
    }

    const internship = await Internship.findByIdAndDelete(id);

    if (!internship) {
      return Response.json({ error: 'Internship not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: 'Internship deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/admin/internships error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
