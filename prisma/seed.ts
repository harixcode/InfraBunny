import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.change.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.snapshot.deleteMany();

  // Load mock Terraform state files
  const mockDataDir = path.join(process.cwd(), 'mock-data');
  
  const ecommerceV1 = JSON.parse(
    fs.readFileSync(path.join(mockDataDir, 'ecommerce-v1.tfstate.json'), 'utf-8')
  );
  const ecommerceV2 = JSON.parse(
    fs.readFileSync(path.join(mockDataDir, 'ecommerce-v2.tfstate.json'), 'utf-8')
  );
  const ecommerceV3 = JSON.parse(
    fs.readFileSync(path.join(mockDataDir, 'ecommerce-v3.tfstate.json'), 'utf-8')
  );
  const analyticsV1 = JSON.parse(
    fs.readFileSync(path.join(mockDataDir, 'analytics-v1.tfstate.json'), 'utf-8')
  );

  // Function to create snapshot from Terraform state
  const createSnapshot = async (tfState: any, projectName: string, timestamp: Date) => {
    const resources = tfState.resources.map((resource: any) => {
      const instance = resource.instances[0];
      return {
        resourceType: resource.type,
        resourceName: resource.name,
        resourceId: instance.attributes.id || `${resource.type}.${resource.name}`,
        attributes: JSON.stringify(instance.attributes),
        tags: instance.attributes.tags ? JSON.stringify(instance.attributes.tags) : null,
        dependencies: instance.dependencies && instance.dependencies.length > 0 
          ? JSON.stringify(instance.dependencies) 
          : null,
      };
    });

    return await prisma.snapshot.create({
      data: {
        projectName,
        createdAt: timestamp,
        terraformState: JSON.stringify(tfState),
        resources: {
          create: resources,
        },
      },
      include: {
        resources: true,
      },
    });
  };

  // Create snapshots with specific timestamps
  const now = new Date();
  
  // E-commerce v1 (3 hours ago)
  const ecomV1Time = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const ecomV1Snapshot = await createSnapshot(ecommerceV1, 'ecommerce-platform', ecomV1Time);
  console.log(`Created e-commerce v1 snapshot: ${ecomV1Snapshot.id}`);

  // E-commerce v2 (1 hour ago)
  const ecomV2Time = new Date(now.getTime() - 60 * 60 * 1000);
  const ecomV2Snapshot = await createSnapshot(ecommerceV2, 'ecommerce-platform', ecomV2Time);
  console.log(`Created e-commerce v2 snapshot: ${ecomV2Snapshot.id}`);

  // E-commerce v3 (10 minutes ago) - Latest with Load Balancer and more changes
  const ecomV3Time = new Date(now.getTime() - 10 * 60 * 1000);
  const ecomV3Snapshot = await createSnapshot(ecommerceV3, 'ecommerce-platform', ecomV3Time);
  console.log(`Created e-commerce v3 snapshot: ${ecomV3Snapshot.id}`);

  // Analytics v1 (1.5 hours ago)
  const analyticsV1Time = new Date(now.getTime() - 90 * 60 * 1000);
  const analyticsV1Snapshot = await createSnapshot(analyticsV1, 'analytics-platform', analyticsV1Time);
  console.log(`Created analytics v1 snapshot: ${analyticsV1Snapshot.id}`);

  console.log('Seed completed successfully!');
  console.log(`Total snapshots: ${await prisma.snapshot.count()}`);
  console.log(`Total resources: ${await prisma.resource.count()}`);
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

