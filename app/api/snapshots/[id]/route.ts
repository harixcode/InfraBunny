import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const snapshot = await prisma.snapshot.findUnique({
      where: { id: params.id },
      include: {
        resources: true,
      },
    });

    if (!snapshot) {
      return NextResponse.json({ error: 'Snapshot not found' }, { status: 404 });
    }

    // Parse JSON fields
    const enrichedSnapshot = {
      ...snapshot,
      resources: snapshot.resources.map((resource) => ({
        ...resource,
        attributes: JSON.parse(resource.attributes),
        tags: resource.tags ? JSON.parse(resource.tags) : null,
        dependencies: resource.dependencies ? JSON.parse(resource.dependencies) : [],
      })),
    };

    return NextResponse.json(enrichedSnapshot);
  } catch (error) {
    console.error('Error fetching snapshot:', error);
    return NextResponse.json({ error: 'Failed to fetch snapshot' }, { status: 500 });
  }
}

