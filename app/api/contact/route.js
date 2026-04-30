// app/api/contact/route.js
import { connectDB } from '@/lib/db';
import Contact from '@/models/Contact';

export async function GET() {
  try {
    await connectDB();

    const contact = await Contact.findOne();

    return Response.json(contact || {});
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: 'Failed to fetch contact info' },
      { status: 500 },
    );
  }
}
