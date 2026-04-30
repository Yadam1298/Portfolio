// app/api/admin/messages/route.js
import { connectDB } from '@/lib/db';
import { UserMessage } from '@/models/Contact';
import { verifyAuth } from '@/lib/auth-middleware';

export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const read = searchParams.get('read');

    const query = {};
    if (read !== null) query.read = read === 'true';

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      UserMessage.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      UserMessage.countDocuments(query),
    ]);

    return Response.json({
      messages,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/admin/messages error:', error);
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
    const { messageId, read, replied } = await req.json();

    const update = {};
    if (read !== undefined) update.read = read;
    if (replied !== undefined) update.replied = replied;

    const message = await UserMessage.findByIdAndUpdate(messageId, update, {
      new: true,
    });

    return Response.json(message);
  } catch (error) {
    console.error('PUT /api/admin/messages error:', error);
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
    const messageId = searchParams.get('id');

    await UserMessage.findByIdAndDelete(messageId);

    return Response.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/messages error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
