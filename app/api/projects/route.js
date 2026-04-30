import { connectDB } from '@/lib/db';
import Project from '@/models/Project';

export async function GET() {
  try {
    await connectDB();

    const projects = await Project.find().sort({
      order: 1,
      createdAt: -1,
    });
    console.log(projects);
    return Response.json(projects, { status: 200 });
  } catch (error) {
    console.error('GET /api/projects error:', error);

    return Response.json(
      { error: 'Failed to fetch projects' },
      { status: 500 },
    );
  }
}
