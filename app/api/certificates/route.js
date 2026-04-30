// app/api/certificates/route.js
import { connectDB } from '@/lib/db';
import Certificate from '@/models/Certificate';

export async function GET() {
  try {
    await connectDB();

    const certificates = await Certificate.find().sort({
      order: 1,
      createdAt: -1,
    });

    return Response.json(certificates);
  } catch (error) {
    console.error('GET /api/certificates error:', error);

    return Response.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 },
    );
  }
}
