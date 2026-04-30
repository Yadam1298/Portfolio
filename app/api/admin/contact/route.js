// app/api/admin/contact/route.js
import { connectDB } from '@/lib/db';
import Contact from '@/models/Contact';
import { verifyAuth } from '@/lib/auth-middleware';

export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const contact = await Contact.findOne();
    return Response.json(contact || {});
  } catch (error) {
    console.error('GET /api/admin/contact error:', error);
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

    const contact = await Contact.findOneAndUpdate(
      {},
      { ...data, updatedAt: new Date() },
      { upsert: true, new: true },
    );

    return Response.json(contact);
  } catch (error) {
    console.error('PUT /api/admin/contact error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
