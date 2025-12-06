import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      projectName,
      resourceType,
      resourceName,
      resourceId,
      modifiedBy,
      changeType,
      changeDetail,
    } = body;

    // Validate required fields
    if (!projectName || !resourceType || !resourceName || !resourceId || !modifiedBy || !changeType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure changeDetail is properly formatted
    const detailToStore = typeof changeDetail === 'string' 
      ? changeDetail 
      : JSON.stringify(changeDetail);

    // Create drift event
    const driftEvent = await prisma.driftEvent.create({
      data: {
        projectName,
        resourceType,
        resourceName,
        resourceId,
        modifiedBy,
        modifiedVia: 'console', // Default to console for simulation
        changeType,
        changeDetail: detailToStore,
        status: 'open',
      },
    });

    // Return with parsed changeDetail for immediate display
    const response = {
      ...driftEvent,
      changeDetail: JSON.parse(detailToStore),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Failed to create drift event:', error);
    return NextResponse.json(
      { error: 'Failed to create drift event' },
      { status: 500 }
    );
  }
}

