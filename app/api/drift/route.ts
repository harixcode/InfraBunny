import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Get drift events for a project
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectName = searchParams.get('project');
    const status = searchParams.get('status');

    const where: any = {};
    if (projectName) {
      where.projectName = projectName;
    }
    if (status) {
      where.status = status;
    }

    const driftEvents = await prisma.driftEvent.findMany({
      where,
      orderBy: { detectedAt: 'desc' },
    });

    // Parse JSON fields safely
    const enrichedEvents = driftEvents.map((event) => {
      try {
        return {
          ...event,
          changeDetail: typeof event.changeDetail === 'string' 
            ? JSON.parse(event.changeDetail) 
            : event.changeDetail,
        };
      } catch (parseError) {
        console.error('Failed to parse changeDetail for event:', event.id, parseError);
        // Return event with empty object if parse fails
        return {
          ...event,
          changeDetail: {},
        };
      }
    });

    return NextResponse.json(enrichedEvents);
  } catch (error) {
    console.error('Failed to fetch drift events:', error);
    // Return empty array on error so frontend doesn't break
    return NextResponse.json([]);
  }
}

// Acknowledge a drift event
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, acknowledgedBy } = body;

    if (!id || !acknowledgedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const driftEvent = await prisma.driftEvent.update({
      where: { id },
      data: {
        status: 'acknowledged',
        acknowledgedBy,
        acknowledgedAt: new Date(),
      },
    });

    return NextResponse.json(driftEvent);
  } catch (error) {
    console.error('Failed to acknowledge drift event:', error);
    return NextResponse.json(
      { error: 'Failed to acknowledge drift event' },
      { status: 500 }
    );
  }
}

