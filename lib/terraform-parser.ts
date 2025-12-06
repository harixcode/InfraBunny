export interface TerraformResource {
  type: string;
  name: string;
  attributes: Record<string, any>;
  dependencies: string[];
}

export interface ParsedTerraformState {
  version: number;
  terraform_version: string;
  resources: TerraformResource[];
}

export function parseTerraformState(stateJson: any): ParsedTerraformState {
  const resources: TerraformResource[] = [];

  if (!stateJson.resources) {
    return {
      version: stateJson.version || 4,
      terraform_version: stateJson.terraform_version || 'unknown',
      resources: [],
    };
  }

  for (const resource of stateJson.resources) {
    if (resource.instances && resource.instances.length > 0) {
      const instance = resource.instances[0];
      resources.push({
        type: resource.type,
        name: resource.name,
        attributes: instance.attributes || {},
        dependencies: instance.dependencies || [],
      });
    }
  }

  return {
    version: stateJson.version,
    terraform_version: stateJson.terraform_version,
    resources,
  };
}

export function extractProjectFromResource(resource: TerraformResource): string | null {
  const tags = resource.attributes.tags;
  if (tags && typeof tags === 'object' && 'Project' in tags) {
    return tags.Project as string;
  }
  return null;
}

export function getResourceAddress(resource: TerraformResource): string {
  return `${resource.type}.${resource.name}`;
}

export function extractResourceRelationships(resources: TerraformResource[]): Map<string, string[]> {
  const relationships = new Map<string, string[]>();
  
  for (const resource of resources) {
    const address = getResourceAddress(resource);
    const relatedResources: string[] = [];

    // Check dependencies
    if (resource.dependencies && resource.dependencies.length > 0) {
      relatedResources.push(...resource.dependencies);
    }

    // Check for attribute-based relationships
    const attrs = resource.attributes;
    
    // VPC relationships
    if (attrs.vpc_id) {
      const vpcResource = resources.find(r => r.attributes.id === attrs.vpc_id);
      if (vpcResource) {
        relatedResources.push(getResourceAddress(vpcResource));
      }
    }

    // Subnet relationships
    if (attrs.subnet_id) {
      const subnetResource = resources.find(r => r.attributes.id === attrs.subnet_id);
      if (subnetResource) {
        relatedResources.push(getResourceAddress(subnetResource));
      }
    }

    // Security group relationships
    if (attrs.vpc_security_group_ids && Array.isArray(attrs.vpc_security_group_ids)) {
      for (const sgId of attrs.vpc_security_group_ids) {
        const sgResource = resources.find(r => r.attributes.id === sgId);
        if (sgResource) {
          relatedResources.push(getResourceAddress(sgResource));
        }
      }
    }

    relationships.set(address, Array.from(new Set(relatedResources)));
  }

  return relationships;
}

export function compareResources(oldResource: TerraformResource, newResource: TerraformResource): any {
  const diff: any = {
    added: {},
    modified: {},
    removed: {},
  };

  const oldAttrs = oldResource.attributes;
  const newAttrs = newResource.attributes;

  // Find added and modified attributes
  for (const [key, newValue] of Object.entries(newAttrs)) {
    if (!(key in oldAttrs)) {
      diff.added[key] = newValue;
    } else if (JSON.stringify(oldAttrs[key]) !== JSON.stringify(newValue)) {
      diff.modified[key] = {
        old: oldAttrs[key],
        new: newValue,
      };
    }
  }

  // Find removed attributes
  for (const key of Object.keys(oldAttrs)) {
    if (!(key in newAttrs)) {
      diff.removed[key] = oldAttrs[key];
    }
  }

  return diff;
}

