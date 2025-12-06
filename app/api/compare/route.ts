import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compareResources } from '@/lib/terraform-parser';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fromId = searchParams.get('from');
    const toId = searchParams.get('to');

    if (!fromId || !toId) {
      return NextResponse.json(
        { error: 'Both "from" and "to" snapshot IDs are required' },
        { status: 400 }
      );
    }

    const [fromSnapshot, toSnapshot] = await Promise.all([
      prisma.snapshot.findUnique({
        where: { id: fromId },
        include: { resources: true },
      }),
      prisma.snapshot.findUnique({
        where: { id: toId },
        include: { resources: true },
      }),
    ]);

    if (!fromSnapshot || !toSnapshot) {
      return NextResponse.json({ error: 'One or both snapshots not found' }, { status: 404 });
    }

    // Parse resources
    const fromResources = fromSnapshot.resources.map((r) => ({
      ...r,
      attributes: JSON.parse(r.attributes),
      tags: r.tags ? JSON.parse(r.tags) : null,
      dependencies: r.dependencies ? JSON.parse(r.dependencies) : [],
    }));

    const toResources = toSnapshot.resources.map((r) => ({
      ...r,
      attributes: JSON.parse(r.attributes),
      tags: r.tags ? JSON.parse(r.tags) : null,
      dependencies: r.dependencies ? JSON.parse(r.dependencies) : [],
    }));

    // Build maps for comparison
    const fromMap = new Map(
      fromResources.map((r) => [`${r.resourceType}.${r.resourceName}`, r])
    );
    const toMap = new Map(
      toResources.map((r) => [`${r.resourceType}.${r.resourceName}`, r])
    );

    const changes: any[] = [];

    // Find added resources
    Array.from(toMap.entries()).forEach(([address, resource]) => {
      if (!fromMap.has(address)) {
        changes.push({
          address,
          changeType: 'added',
          resource: resource,
        });
      }
    });

    // Find deleted resources
    Array.from(fromMap.entries()).forEach(([address, resource]) => {
      if (!toMap.has(address)) {
        changes.push({
          address,
          changeType: 'deleted',
          resource: resource,
        });
      }
    });

    // Find modified resources
    Array.from(fromMap.entries()).forEach(([address, fromResource]) => {
      const toResource = toMap.get(address);
      if (toResource) {
        const diff = compareResources(
          { type: fromResource.resourceType, name: fromResource.resourceName, attributes: fromResource.attributes, dependencies: fromResource.dependencies },
          { type: toResource.resourceType, name: toResource.resourceName, attributes: toResource.attributes, dependencies: toResource.dependencies }
        );

        if (
          Object.keys(diff.added).length > 0 ||
          Object.keys(diff.modified).length > 0 ||
          Object.keys(diff.removed).length > 0
        ) {
          changes.push({
            address,
            changeType: 'modified',
            resource: toResource,
            diff,
          });
        }
      }
    });

    return NextResponse.json({
      from: {
        id: fromSnapshot.id,
        projectName: fromSnapshot.projectName,
        createdAt: fromSnapshot.createdAt,
      },
      to: {
        id: toSnapshot.id,
        projectName: toSnapshot.projectName,
        createdAt: toSnapshot.createdAt,
      },
      changes,
    });
  } catch (error) {
    console.error('Error comparing snapshots:', error);
    return NextResponse.json({ error: 'Failed to compare snapshots' }, { status: 500 });
  }
}

