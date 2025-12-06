import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseTerraformState } from '@/lib/terraform-parser';
import { applyDeploymentTemplate } from '@/lib/deployment-templates';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      projectName,
      templateId,
      deployedBy,
      deploymentNotes,
    } = body;

    // Validate required fields
    if (!projectName || !templateId || !deployedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the latest snapshot for this project
    const latestSnapshot = await prisma.snapshot.findFirst({
      where: { projectName },
      orderBy: { createdAt: 'desc' },
    });

    if (!latestSnapshot) {
      return NextResponse.json(
        { error: 'No existing snapshot found for this project' },
        { status: 404 }
      );
    }

    // Parse the existing Terraform state
    const existingState = JSON.parse(latestSnapshot.terraformState);

    // Apply the deployment template
    const newState = applyDeploymentTemplate(existingState, templateId);

    // Parse the new state to extract resources
    const parsed = parseTerraformState(newState);

    // Create new snapshot
    const newSnapshot = await prisma.snapshot.create({
      data: {
        projectName,
        terraformState: JSON.stringify(newState),
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
        _count: {
          select: { resources: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      snapshot: {
        id: newSnapshot.id,
        projectName: newSnapshot.projectName,
        createdAt: newSnapshot.createdAt,
        resourceCount: newSnapshot._count.resources,
        deployedBy,
        notes: deploymentNotes,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to simulate deployment:', error);
    return NextResponse.json(
      { error: 'Failed to simulate deployment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

