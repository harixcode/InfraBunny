import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseTerraformState, extractProjectFromResource, getResourceAddress } from '@/lib/terraform-parser';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectName = searchParams.get('project');

    const where = projectName ? { projectName } : {};
    
    const snapshots = await prisma.snapshot.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        projectName: true,
        createdAt: true,
        _count: {
          select: {
            resources: true,
          },
        },
      },
    });

    return NextResponse.json(snapshots);
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    return NextResponse.json({ error: 'Failed to fetch snapshots' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { terraformState, projectName } = body;

    if (!terraformState || !projectName) {
      return NextResponse.json(
        { error: 'terraformState and projectName are required' },
        { status: 400 }
      );
    }

    // Parse Terraform state
    const parsed = parseTerraformState(terraformState);

    // Create snapshot
    const snapshot = await prisma.snapshot.create({
      data: {
        projectName,
        terraformState: JSON.stringify(terraformState),
        resources: {
          create: parsed.resources.map((resource) => ({
            resourceType: resource.type,
            resourceName: resource.name,
            resourceId: resource.attributes.id || `${resource.type}.${resource.name}`,
            attributes: JSON.stringify(resource.attributes),
            tags: resource.attributes.tags ? JSON.stringify(resource.attributes.tags) : null,
            dependencies: resource.dependencies.length > 0 ? JSON.stringify(resource.dependencies) : null,
          })),
        },
      },
      include: {
        resources: true,
      },
    });

    return NextResponse.json(snapshot, { status: 201 });
  } catch (error) {
    console.error('Error creating snapshot:', error);
    return NextResponse.json({ error: 'Failed to create snapshot' }, { status: 500 });
  }
}

