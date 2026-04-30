import { connectDB } from '@/lib/db';
import Certificate from '@/models/Certificate';
import { verifyAuth } from '@/lib/auth-middleware';

export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const certificates = await Certificate.find().sort({
      order: 1,
      createdAt: -1,
    });
    return Response.json(certificates);
  } catch (error) {
    console.error('GET /api/admin/certificates error:', error);
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
    const lastCert = await Certificate.findOne().sort({ order: -1 });
    const newOrder = lastCert ? lastCert.order + 1 : 0;

    const certificate = await Certificate.create({
      title: data.title,
      organization: data.organization,
      date: data.date,
      certificateLink: data.certificateLink || '',
      logoUrl: data.logoUrl || '',
      order: newOrder,
    });

    return Response.json(certificate, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/certificates error:', error);
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

    const certificate = await Certificate.findByIdAndUpdate(
      id,
      {
        title: data.title,
        organization: data.organization,
        date: data.date,
        certificateLink: data.certificateLink || '',
        logoUrl: data.logoUrl || '',
      },
      { new: true, runValidators: true },
    );

    if (!certificate) {
      return Response.json({ error: 'Certificate not found' }, { status: 404 });
    }

    return Response.json(certificate);
  } catch (error) {
    console.error('PUT /api/admin/certificates error:', error);
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
        { error: 'Certificate ID required' },
        { status: 400 },
      );
    }

    const certificate = await Certificate.findByIdAndDelete(id);

    if (!certificate) {
      return Response.json({ error: 'Certificate not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: 'Certificate deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/admin/certificates error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
