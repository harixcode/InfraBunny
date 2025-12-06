import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get distinct project names from snapshots
    const projects = await prisma.snapshot.groupBy({
      by: ['projectName'],
      _count: {
        projectName: true,
      },
      _max: {
        createdAt: true,
      },
    });

    const projectList = projects.map((p) => ({
      name: p.projectName,
      snapshotCount: p._count.projectName,
      lastUpdated: p._max.createdAt,
    }));

    return NextResponse.json(projectList);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

