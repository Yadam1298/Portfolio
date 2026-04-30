import { connectDB } from '@/lib/db';
import Internship from '@/models/Internship';

export async function GET() {
  try {
    await connectDB();

    const internships = await Internship.find().sort({
      order: 1,
      createdAt: -1,
    });

    return Response.json(internships, { status: 200 });
  } catch (error) {
    console.error('GET /api/internships error:', error);

    return Response.json(
      { error: 'Failed to fetch internships' },
      { status: 500 },
    );
  }
}
