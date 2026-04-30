// app/api/admin/testimonials/route.js
import { connectDB } from '@/lib/db';
import Testimonial from '@/models/Testimonial';
import { verifyAuth } from '@/lib/auth-middleware';

export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    // Get all testimonials (including unapproved) for admin
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    return Response.json(testimonials);
  } catch (error) {
    console.error('GET /api/admin/testimonials error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    // No auth required for posting testimonials
    await connectDB();
    const data = await req.json();

    console.log('Received testimonial data:', data);
    if (!data.name || !data.message) {
      return Response.json(
        { error: 'Name and message are required' },
        { status: 400 },
      );
    }

    const testimonial = await Testimonial.create({
      name: data.name.trim(),
      message: data.message.trim(),
      isApproved: false, // Needs admin approval
    });

    return Response.json(
      { success: true, message: 'Testimonial submitted successfully!' },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST /api/admin/testimonials error:', error);
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
    const { id, isApproved } = await req.json();

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true },
    );

    if (!testimonial) {
      return Response.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return Response.json(testimonial);
  } catch (error) {
    console.error('PUT /api/admin/testimonials error:', error);
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
        { error: 'Testimonial ID required' },
        { status: 400 },
      );
    }

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return Response.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/admin/testimonials error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
