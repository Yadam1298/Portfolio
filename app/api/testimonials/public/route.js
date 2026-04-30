// app/api/testimonials/public/route.js
import { connectDB } from '@/lib/db';
import Testimonial from '@/models/Testimonial';

export async function GET() {
  try {
    await connectDB();
    // Only return approved testimonials
    const testimonials = await Testimonial.find({ isApproved: true }).sort({
      createdAt: -1,
    });
    return Response.json(testimonials);
  } catch (error) {
    console.error('GET /api/testimonials/public error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ADD THIS POST METHOD
export async function POST(req) {
  try {
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

    console.log('Created testimonial:', testimonial);

    return Response.json(
      { success: true, message: 'Testimonial submitted successfully!' },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST /api/testimonials/public error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
