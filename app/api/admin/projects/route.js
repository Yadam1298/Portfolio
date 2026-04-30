import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import { verifyAuth } from '@/lib/auth-middleware';

export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    return Response.json(projects);
  } catch (error) {
    console.error('GET /api/admin/projects error:', error);
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
    console.log('PROJECT CREATE PAYLOAD:', data);

    const lastProject = await Project.findOne().sort({ order: -1 });
    const newOrder = lastProject ? lastProject.order + 1 : 0;

    const project = await Project.create({
      projectTitle: data.projectTitle || '',
      description: data.description || '',
      technologies: data.technologies || [],

      // ✅ IMPORTANT: normalize all link fields
      gitrepoLink: data.gitrepoLink || data.gitRepoLink || '',
      abstractLink: data.abstractLink || '',
      liveDemoVideoLink: data.liveDemoVideoLink || '',

      featured: data.featured || false,
      order: newOrder,
    });

    return Response.json(project, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/projects error:', error);
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
    console.log('PROJECT UPDATE PAYLOAD:', data);

    const project = await Project.findByIdAndUpdate(
      data.id,
      {
        projectTitle: data.projectTitle,
        description: data.description,
        technologies: data.technologies || [],

        gitrepoLink: data.gitrepoLink || data.gitRepoLink || '',
        abstractLink: data.abstractLink || '',
        liveDemoVideoLink: data.liveDemoVideoLink || '',

        featured: data.featured || false,
      },
      { new: true, runValidators: true },
    );

    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    return Response.json(project);
  } catch (error) {
    console.error('PUT /api/admin/projects error:', error);
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
      return Response.json({ error: 'Project ID required' }, { status: 400 });
    }

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/admin/projects error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
