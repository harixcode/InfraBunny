// Deployment templates for simulating infrastructure changes

export interface DeploymentTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  changes: string[];
}

export const deploymentTemplates: DeploymentTemplate[] = [
  {
    id: 'add_instances',
    name: 'Scale Up - Add Instances',
    description: 'Add 2 new EC2 instances for increased capacity',
    icon: '📈',
    changes: [
      'Added 2x t3.medium EC2 instances',
      'Updated load balancer target group',
      'Increased Auto Scaling Group max size',
    ],
  },
  {
    id: 'scale_database',
    name: 'Scale Database',
    description: 'Upgrade RDS instance class for better performance',
    icon: '🗄️',
    changes: [
      'Upgraded RDS from db.t3.micro to db.t3.medium',
      'Increased storage from 100GB to 200GB',
      'Updated backup retention to 7 days',
    ],
  },
  {
    id: 'add_cache',
    name: 'Add Caching Layer',
    description: 'Deploy Redis cache for improved performance',
    icon: '⚡',
    changes: [
      'Created ElastiCache Redis cluster',
      'Added cache security group',
      'Updated application configuration',
    ],
  },
  {
    id: 'add_monitoring',
    name: 'Deploy Monitoring',
    description: 'Add CloudWatch alarms and dashboards',
    icon: '📊',
    changes: [
      'Created CloudWatch dashboard',
      'Added CPU and memory alarms',
      'Configured SNS notifications',
    ],
  },
  {
    id: 'optimize_security',
    name: 'Security Hardening',
    description: 'Update security groups and enable encryption',
    icon: '🔒',
    changes: [
      'Restricted security group rules',
      'Enabled S3 bucket encryption',
      'Added VPC flow logs',
    ],
  },
  {
    id: 'add_cdn',
    name: 'Add CDN',
    description: 'Deploy CloudFront distribution',
    icon: '🌐',
    changes: [
      'Created CloudFront distribution',
      'Added SSL certificate',
      'Configured origin settings',
    ],
  },
];

// Function to apply a template to existing state
export function applyDeploymentTemplate(
  existingState: any,
  templateId: string
): any {
  // Clone the existing state
  const newState = JSON.parse(JSON.stringify(existingState));
  
  // Update version metadata
  if (!newState.version) {
    newState.version = 1;
  }
  newState.version += 1;
  newState.serial = (newState.serial || 0) + 1;
  newState.terraform_version = existingState.terraform_version || '1.5.0';
  
  // Apply template-specific changes
  switch (templateId) {
    case 'add_instances':
      return applyAddInstances(newState);
    case 'scale_database':
      return applyScaleDatabase(newState);
    case 'add_cache':
      return applyAddCache(newState);
    case 'add_monitoring':
      return applyAddMonitoring(newState);
    case 'optimize_security':
      return applyOptimizeSecurity(newState);
    case 'add_cdn':
      return applyAddCDN(newState);
    default:
      return newState;
  }
}

function applyAddInstances(state: any): any {
  // Find existing instances and add similar ones
  const instances = state.resources?.filter((r: any) => 
    r.type === 'aws_instance'
  ) || [];
  
  if (instances.length > 0) {
    const baseInstance = instances[0];
    const newInstanceCount = state.resources.filter((r: any) => 
      r.type === 'aws_instance'
    ).length + 1;
    
    // Add 2 new instances
    for (let i = 0; i < 2; i++) {
      state.resources.push({
        ...JSON.parse(JSON.stringify(baseInstance)),
        name: `web_server_${newInstanceCount + i}`,
        instances: [{
          ...baseInstance.instances[0],
          attributes: {
            ...baseInstance.instances[0].attributes,
            id: `i-${Math.random().toString(36).substr(2, 17)}`,
            private_ip: `10.0.1.${100 + newInstanceCount + i}`,
          }
        }]
      });
    }
  }
  
  return state;
}

function applyScaleDatabase(state: any): any {
  // Find RDS instance and upgrade it
  const dbInstances = state.resources?.filter((r: any) => 
    r.type === 'aws_db_instance'
  ) || [];
  
  if (dbInstances.length > 0) {
    dbInstances.forEach((db: any) => {
      if (db.instances && db.instances[0]) {
        db.instances[0].attributes.instance_class = 'db.t3.medium';
        db.instances[0].attributes.allocated_storage = 200;
        db.instances[0].attributes.backup_retention_period = 7;
      }
    });
  }
  
  return state;
}

function applyAddCache(state: any): any {
  // Add a Redis cache resource
  const cacheId = `cache-${Math.random().toString(36).substr(2, 9)}`;
  
  state.resources.push({
    mode: 'managed',
    type: 'aws_elasticache_cluster',
    name: 'redis_cache',
    provider: 'provider["registry.terraform.io/hashicorp/aws"]',
    instances: [{
      schema_version: 0,
      attributes: {
        id: cacheId,
        cluster_id: 'app-cache',
        engine: 'redis',
        node_type: 'cache.t3.micro',
        num_cache_nodes: 1,
        parameter_group_name: 'default.redis6.x',
        port: 6379,
        tags: {
          Name: 'Application Cache',
          Environment: 'production'
        }
      }
    }]
  });
  
  return state;
}

function applyAddMonitoring(state: any): any {
  // Add CloudWatch dashboard resource
  state.resources.push({
    mode: 'managed',
    type: 'aws_cloudwatch_dashboard',
    name: 'main_dashboard',
    provider: 'provider["registry.terraform.io/hashicorp/aws"]',
    instances: [{
      schema_version: 0,
      attributes: {
        id: 'application-dashboard',
        dashboard_name: 'application-monitoring',
        dashboard_body: '{}',
        tags: {
          Name: 'Main Dashboard',
          Environment: 'production'
        }
      }
    }]
  });
  
  return state;
}

function applyOptimizeSecurity(state: any): any {
  // Update S3 buckets to enable encryption
  const s3Buckets = state.resources?.filter((r: any) => 
    r.type === 'aws_s3_bucket'
  ) || [];
  
  s3Buckets.forEach((bucket: any) => {
    if (bucket.instances && bucket.instances[0]) {
      bucket.instances[0].attributes.server_side_encryption_configuration = {
        rule: {
          apply_server_side_encryption_by_default: {
            sse_algorithm: 'AES256'
          }
        }
      };
    }
  });
  
  return state;
}

function applyAddCDN(state: any): any {
  // Add CloudFront distribution
  const distId = `E${Math.random().toString(36).substr(2, 13).toUpperCase()}`;
  
  state.resources.push({
    mode: 'managed',
    type: 'aws_cloudfront_distribution',
    name: 'cdn',
    provider: 'provider["registry.terraform.io/hashicorp/aws"]',
    instances: [{
      schema_version: 1,
      attributes: {
        id: distId,
        domain_name: `${distId.toLowerCase()}.cloudfront.net`,
        enabled: true,
        status: 'Deployed',
        tags: {
          Name: 'CDN Distribution',
          Environment: 'production'
        }
      }
    }]
  });
  
  return state;
}

