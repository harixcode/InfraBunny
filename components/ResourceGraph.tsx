'use client';

import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  BackgroundVariant,
  MarkerType,
  Position,
  Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface Resource {
  id: string;
  resourceType: string;
  resourceName: string;
  resourceId: string;
  attributes: any;
  tags: any;
  dependencies: string[] | null;
}

interface ResourceGraphProps {
  resources: Resource[];
  changes?: any[];
  onNodeClick?: (resource: Resource) => void;
}

const getNodeColor = (resourceType: string): string => {
  // Resource type colors - softer pastels for better readability
  // Network & Infrastructure (Blue tones)
  if (resourceType.includes('vpc')) return '#bfdbfe'; // light blue
  if (resourceType.includes('subnet')) return '#ddd6fe'; // light purple
  if (resourceType.includes('security_group')) return '#fed7aa'; // light orange
  
  // Compute (Pink/Rose tones)
  if (resourceType.includes('instance') || resourceType.includes('ec2')) return '#fecaca'; // light red/pink
  if (resourceType.includes('lambda')) return '#fde68a'; // light yellow
  
  // Storage (Green tones)
  if (resourceType.includes('s3')) return '#bbf7d0'; // light green
  if (resourceType.includes('db') || resourceType.includes('rds')) return '#c7d2fe'; // light indigo
  if (resourceType.includes('dynamodb')) return '#e9d5ff'; // light purple
  
  // API & Services (Cyan tones)
  if (resourceType.includes('api_gateway')) return '#bae6fd'; // light sky
  if (resourceType.includes('lb')) return '#fcd34d'; // light amber for load balancers
  
  return '#e2e8f0'; // light gray for unknown
};

const getChangeBorder = (changeType?: string): string => {
  if (changeType === 'added') return '4px solid #22c55e'; // green border
  if (changeType === 'modified') return '4px solid #f59e0b'; // amber border
  if (changeType === 'deleted') return '4px solid #ef4444'; // red border
  return ''; // no special border
};

const getResourceIcon = (resourceType: string): string => {
  if (resourceType.includes('vpc')) return '🌐';
  if (resourceType.includes('subnet')) return '🔌';
  if (resourceType.includes('instance') || resourceType.includes('ec2')) return '🖥️';
  if (resourceType.includes('security_group')) return '🛡️';
  if (resourceType.includes('db') || resourceType.includes('rds')) return '🗄️';
  if (resourceType.includes('s3')) return '📦';
  if (resourceType.includes('lambda')) return '⚡';
  if (resourceType.includes('dynamodb')) return '📊';
  if (resourceType.includes('api_gateway')) return '🔗';
  return '📋';
};

export default function ResourceGraph({ resources, changes, onNodeClick }: ResourceGraphProps) {
  // Extract project name from resources
  const projectName = useMemo(() => {
    if (resources.length === 0) return 'Unknown Project';
    
    // Try to get project name from tags
    for (const resource of resources) {
      if (resource.tags && resource.tags.Project) {
        return resource.tags.Project;
      }
    }
    return 'Unknown Project';
  }, [resources]);

  // Build change map
  const changeMap = useMemo(() => {
    const map = new Map<string, string>();
    if (changes) {
      changes.forEach((change) => {
        map.set(change.address, change.changeType);
      });
    }
    return map;
  }, [changes]);

  // Create nodes and edges with hierarchical layout (VPC -> Subnet -> Instances)
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeMap = new Map<string, string>(); // address/id -> node id
    const processedResources = new Set<string>(); // Track which resources we've added

    // Find VPCs first (they will be top-level container nodes)
    const vpcs = resources.filter(r => r.resourceType.includes('vpc') && r.resourceType.includes('aws_vpc'));
    
    let vpcYOffset = 50;

    if (vpcs.length > 0) {
      // VPC-based architecture
      vpcs.forEach((vpc) => {
        const vpcAddress = `${vpc.resourceType}.${vpc.resourceName}`;
        const vpcChangeType = changeMap.get(vpcAddress);
        
        // Find all resources that belong to this VPC
        const vpcChildren = resources.filter(r => {
          if (r.id === vpc.id) return false;
          
          // Check various ways a resource can belong to a VPC
          const attrs = r.attributes;
          
          // Direct vpc_id reference (covers security groups, subnets, databases, etc.)
          if (attrs.vpc_id === vpc.attributes.id) {
            return true;
          }
          
          // Resources in subnets of this VPC (EC2 instances, etc.)
          if (attrs.subnet_id) {
            const subnet = resources.find(s => 
              s.resourceType.includes('subnet') && 
              s.attributes.id === attrs.subnet_id &&
              s.attributes.vpc_id === vpc.attributes.id
            );
            if (subnet) return true;
          }
          
          // Resources with subnets array (like load balancers)
          if (attrs.subnets && Array.isArray(attrs.subnets)) {
            const hasSubnetInVpc = attrs.subnets.some((subnetId: string) => {
              const subnet = resources.find(s => 
                s.resourceType.includes('subnet') && 
                s.attributes.id === subnetId &&
                s.attributes.vpc_id === vpc.attributes.id
              );
              return !!subnet;
            });
            if (hasSubnetInVpc) return true;
          }
          
          return false;
        });

        // Calculate VPC width based on subnets (2 per row)
        const subnetsForSize = vpcChildren.filter(r => r.resourceType.includes('subnet'));
        const subnetsPerRowCalc = Math.min(2, subnetsForSize.length);
        const vpcWidth = Math.max(700, subnetsPerRowCalc * 300 + 100);
        
        // We'll calculate VPC height dynamically after placing all children
        // For now, create a placeholder that we'll update
        let vpcHeight = 500; // Initial placeholder
        const vpcNodeIndex = nodes.length; // Remember where VPC node is

        // Create VPC container node
        nodes.push({
          id: vpc.id,
          type: 'default',
          data: {
            label: (
              <div>
                <div className="flex items-center gap-2 mb-2 pb-2 border-b-2 border-blue-400">
                  <span className="text-2xl">{getResourceIcon(vpc.resourceType)}</span>
                  <div>
                    <div className="font-bold text-base">{vpc.resourceName}</div>
                    <div className="text-[10px] text-gray-500">{vpc.resourceType}</div>
                    <div className="text-xs text-gray-600 font-mono">{vpc.attributes.cidr_block}</div>
                  </div>
                </div>
              </div>
            ),
          },
          position: { x: 50, y: vpcYOffset },
          style: {
            background: 'rgba(191, 219, 254, 0.15)',
            border: vpcChangeType ? getChangeBorder(vpcChangeType) : '2px dashed #60a5fa',
            borderRadius: '12px',
            padding: '20px',
            width: vpcWidth,
            height: vpcHeight,
            zIndex: 0,
          },
        });

        nodeMap.set(vpcAddress, vpc.id);
        nodeMap.set(vpc.attributes.id, vpc.id);
        processedResources.add(vpc.id);

        // Get subnets in this VPC
        const subnets = vpcChildren.filter(r => r.resourceType.includes('subnet'));
        
        // Get resources that belong in subnets or span multiple subnets
        const subnetResources = vpcChildren.filter(r => {
          const attrs = r.attributes;
          return !r.resourceType.includes('subnet') && 
                 !r.resourceType.includes('security_group') &&
                 (attrs.subnet_id || (attrs.subnets && Array.isArray(attrs.subnets)));
        });
        
        // Get VPC-level resources (security groups, databases without subnet, etc.)
        const vpcLevelResources = vpcChildren.filter(r => {
          const attrs = r.attributes;
          // Include security groups and resources that are VPC-wide but not in specific subnets
          if (r.resourceType.includes('security_group')) return true;
          if (r.resourceType.includes('db_instance') && !attrs.subnet_id) return true;
          // Other VPC-level resources
          return !r.resourceType.includes('subnet') && 
                 !attrs.subnet_id && 
                 !(attrs.subnets && Array.isArray(attrs.subnets));
        });

        // Layout configuration - all positions are RELATIVE to VPC container
        // Start lower to account for taller VPC header (with resource type line)
        let currentY = 90;
        const subnetSpacingX = 20;
        const subnetSpacingY = 20;
        const startX = 40;

        // Create subnet containers with their resources inside
        let subnetX = startX;
        const subnetsPerRow = Math.min(2, subnets.length);
        let maxSubnetBottomY = currentY; // Track the bottom-most Y position of subnets
        
        subnets.forEach((subnet, subnetIdx) => {
          const subnetAddress = `${subnet.resourceType}.${subnet.resourceName}`;
          const subnetChangeType = changeMap.get(subnetAddress);
          
          // Find resources in this subnet
          const resourcesInSubnet = subnetResources.filter(r => {
            const attrs = r.attributes;
            // Direct subnet_id match
            if (attrs.subnet_id === subnet.attributes.id) return true;
            // Load balancers with multiple subnets
            if (attrs.subnets && Array.isArray(attrs.subnets) && attrs.subnets.includes(subnet.attributes.id)) return true;
            return false;
          });

          const subnetResourceCount = resourcesInSubnet.length;
          const subnetWidth = 280;
          // Increased height to account for taller header with resource type
          const subnetHeight = Math.max(200, subnetResourceCount * 120 + 90);

          // Create subnet container
          nodes.push({
            id: subnet.id,
            type: 'default',
            parentNode: vpc.id,
            extent: 'parent' as const,
            data: {
              label: (
                <div>
                  <div className="flex items-center gap-1 mb-1 pb-1 border-b border-purple-300">
                    <span className="text-base">{getResourceIcon(subnet.resourceType)}</span>
                    <div>
                      <div className="font-semibold text-xs">{subnet.resourceName}</div>
                      <div className="text-[8px] text-gray-500">{subnet.resourceType}</div>
                      <div className="text-[9px] text-gray-600 font-mono">{subnet.attributes.cidr_block}</div>
                    </div>
                  </div>
                </div>
              ),
            },
            position: { x: subnetX, y: currentY },
            style: {
              background: 'rgba(221, 214, 254, 0.3)',
              border: subnetChangeType ? getChangeBorder(subnetChangeType) : '2px dashed #a78bfa',
              borderRadius: '8px',
              padding: '12px',
              width: subnetWidth,
              height: subnetHeight,
              zIndex: 1,
            },
          });

          nodeMap.set(subnetAddress, subnet.id);
          nodeMap.set(subnet.attributes.id, subnet.id);
          processedResources.add(subnet.id);

          // Add resources inside this subnet
          // Start lower to account for taller header (with resource type line)
          let resourceY = 60;
          resourcesInSubnet.forEach((resource) => {
            const resourceAddress = `${resource.resourceType}.${resource.resourceName}`;
            const resourceChangeType = changeMap.get(resourceAddress);

            nodes.push({
              id: resource.id,
              type: 'default',
              parentNode: subnet.id,
              extent: 'parent' as const,
              sourcePosition: Position.Bottom, // Arrows exit from bottom (going down to SG)
              targetPosition: Position.Top,    // Arrows enter from top
              data: {
                label: (
                  <div className="text-center">
                    <div className="text-lg mb-0.5">{getResourceIcon(resource.resourceType)}</div>
                    <div className="font-semibold text-[10px]">{resource.resourceName}</div>
                    <div className="text-[8px] text-gray-500">
                      {resource.resourceType.includes('_') ? resource.resourceType.split('_').slice(1).join('_') : resource.resourceType}
                    </div>
                  </div>
                ),
              },
              position: { x: 20, y: resourceY },
              style: {
                background: getNodeColor(resource.resourceType),
                border: resourceChangeType ? getChangeBorder(resourceChangeType) : '1px solid #6b7280',
                borderRadius: '6px',
                padding: '6px',
                width: 130,
                height: 85,
              },
            });

            nodeMap.set(resourceAddress, resource.id);
            nodeMap.set(resource.attributes.id, resource.id);
            processedResources.add(resource.id);

            resourceY += 100;
          });

          // Track the maximum bottom position
          const thisSubnetBottom = currentY + subnetHeight;
          if (thisSubnetBottom > maxSubnetBottomY) {
            maxSubnetBottomY = thisSubnetBottom;
          }

          // Move to next subnet position
          subnetX += subnetWidth + subnetSpacingX;
          if ((subnetIdx + 1) % subnetsPerRow === 0) {
            subnetX = startX;
            currentY += subnetHeight + subnetSpacingY;
          }
        });

        // Position VPC-level resources below all subnets
        if (subnets.length > 0) {
          currentY = maxSubnetBottomY + 30; // 30px spacing after subnets
        }

        // Add VPC-level resources (security groups, databases, etc.) at the bottom
        let maxBottomY = currentY; // Track the absolute bottom position inside VPC
        
        if (vpcLevelResources.length > 0) {
          // Add spacing before VPC-level resources
          currentY += 30;
          
          let vpcResourceX = startX;
          const resourcesPerRow = Math.min(3, Math.max(2, Math.ceil(Math.sqrt(vpcLevelResources.length))));
          let maxYInThisRow = currentY;
          
          vpcLevelResources.forEach((resource, idx) => {
            const resourceAddress = `${resource.resourceType}.${resource.resourceName}`;
            const resourceChangeType = changeMap.get(resourceAddress);

          nodes.push({
            id: resource.id,
            type: 'default',
            parentNode: vpc.id,
            extent: 'parent' as const,
            sourcePosition: Position.Top,     // Security groups: arrows exit from top (going up)
            targetPosition: Position.Bottom,  // Arrows enter from bottom (instances connect to SG)
            data: {
              label: (
                <div className="text-center">
                  <div className="text-xl mb-1">{getResourceIcon(resource.resourceType)}</div>
                  <div className="font-semibold text-xs">{resource.resourceName}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {resource.resourceType.includes('_') ? resource.resourceType.split('_').slice(1).join('_') : resource.resourceType}
                  </div>
                </div>
              ),
            },
            position: { x: vpcResourceX, y: currentY },
            style: {
              background: getNodeColor(resource.resourceType),
              border: resourceChangeType ? getChangeBorder(resourceChangeType) : '1px solid #6b7280',
              borderRadius: '8px',
              padding: '8px',
              width: 160,
              height: 100,
            },
          });

            nodeMap.set(resourceAddress, resource.id);
            nodeMap.set(resource.attributes.id, resource.id);
            processedResources.add(resource.id);

            // Track the bottom-most Y position
            const thisResourceBottom = currentY + 100; // 100 is resource height
            if (thisResourceBottom > maxBottomY) {
              maxBottomY = thisResourceBottom;
            }

            vpcResourceX += 180;
            if ((idx + 1) % resourcesPerRow === 0) {
              vpcResourceX = startX;
              currentY += 120;
            }
          });
        }
        
        // Now calculate the actual VPC height based on where content ends
        vpcHeight = maxBottomY + 40; // Add 40px bottom padding
        
        // Update the VPC node with the correct height
        nodes[vpcNodeIndex].style = {
          ...nodes[vpcNodeIndex].style,
          height: vpcHeight,
        };

        vpcYOffset += vpcHeight + 80;
      });
    }

    // Add resources that aren't in any VPC (standalone resources)
    const standaloneResources = resources.filter(r => !processedResources.has(r.id));
    
    if (standaloneResources.length > 0) {
      let standaloneX = vpcs.length > 0 ? 850 : 100;
      let standaloneY = 50;
      
      standaloneResources.forEach((resource) => {
        const address = `${resource.resourceType}.${resource.resourceName}`;
        const changeType = changeMap.get(address);
        
        nodes.push({
          id: resource.id,
          type: 'default',
          data: {
            label: (
              <div className="text-center">
                <div className="text-xl mb-1">{getResourceIcon(resource.resourceType)}</div>
                <div className="font-semibold text-xs">{resource.resourceName}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{resource.resourceType}</div>
              </div>
            ),
          },
          position: { x: standaloneX, y: standaloneY },
          style: {
            background: getNodeColor(resource.resourceType),
            border: changeType ? getChangeBorder(changeType) : '1px solid #6b7280',
            borderRadius: '8px',
            padding: '10px',
            width: 180,
            height: 110,
          },
        });

        nodeMap.set(address, resource.id);
        nodeMap.set(resource.attributes.id, resource.id);
        
        standaloneY += 140;
      });
    }

    // Create edges for ALL dependencies automatically
    resources.forEach((resource) => {
      const fromNodeId = nodeMap.get(`${resource.resourceType}.${resource.resourceName}`);
      if (!fromNodeId) return;
      
      const attrs = resource.attributes;
      const createdEdges = new Set<string>(); // Avoid duplicate edges

      // Helper to create an edge
      const createEdge = (targetAddress: string, edgeStyle: any) => {
        const targetNodeId = nodeMap.get(targetAddress);
        if (targetNodeId && targetNodeId !== fromNodeId) {
          const edgeId = `${fromNodeId}-${targetNodeId}`;
          if (!createdEdges.has(edgeId)) {
            // Check if relationship is already shown by nesting
            const sourceNode = nodes.find(n => n.id === fromNodeId);
            const targetNode = nodes.find(n => n.id === targetNodeId);
            
            // Skip if target is the parent (containment relationship)
            if (sourceNode?.parentNode === targetNodeId) return;
            
            // Skip if source is the parent (reverse containment)
            if (targetNode?.parentNode === fromNodeId) return;
            
            edges.push({
              id: edgeId,
              source: fromNodeId,
              target: targetNodeId,
              ...edgeStyle,
            });
            createdEdges.add(edgeId);
          }
        }
      };

      // 1. Process explicit dependencies array from Terraform
      // Skip VPC and Subnet dependencies as they're shown by visual nesting
      if (resource.dependencies && Array.isArray(resource.dependencies)) {
        resource.dependencies.forEach((dep: string) => {
          // Skip if dependency is to VPC or Subnet (shown by nesting)
          if (dep.includes('aws_vpc.') || dep.includes('aws_subnet.')) return;
          
          createEdge(dep, {
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#6b7280', strokeWidth: 1.5, strokeDasharray: '5,5' },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#6b7280' },
          });
        });
      }

      // 2. Security group relationships (special styling)
      if (attrs.vpc_security_group_ids && Array.isArray(attrs.vpc_security_group_ids)) {
        attrs.vpc_security_group_ids.forEach((sgId: string) => {
          const sgResource = resources.find((r) => r.attributes.id === sgId);
          if (sgResource) {
            const sgAddress = `${sgResource.resourceType}.${sgResource.resourceName}`;
            createEdge(sgAddress, {
              type: 'smoothstep',
              animated: false,
              style: { stroke: '#f97316', strokeWidth: 2 },
              markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' },
              label: '🛡️',
              labelStyle: { fontSize: 10 },
              labelBgStyle: { fill: 'white' },
            });
          }
        });
      }

      // 3. Security groups array (for load balancers, etc.)
      if (attrs.security_groups && Array.isArray(attrs.security_groups)) {
        attrs.security_groups.forEach((sgId: string) => {
          const sgResource = resources.find((r) => r.attributes.id === sgId);
          if (sgResource) {
            const sgAddress = `${sgResource.resourceType}.${sgResource.resourceName}`;
            createEdge(sgAddress, {
              type: 'smoothstep',
              animated: false,
              style: { stroke: '#f97316', strokeWidth: 2 },
              markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' },
              label: '🛡️',
              labelStyle: { fontSize: 10 },
              labelBgStyle: { fill: 'white' },
            });
          }
        });
      }

      // 4. Multiple subnets (for load balancers, RDS multi-AZ, etc.)
      if (attrs.subnets && Array.isArray(attrs.subnets)) {
        attrs.subnets.forEach((subnetId: string) => {
          const subnetResource = resources.find((r) => r.attributes.id === subnetId);
          if (subnetResource) {
            const subnetAddress = `${subnetResource.resourceType}.${subnetResource.resourceName}`;
            createEdge(subnetAddress, {
              type: 'smoothstep',
              animated: false,
              style: { stroke: '#8b5cf6', strokeWidth: 2 },
              markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
              label: '🔗',
              labelStyle: { fontSize: 10 },
              labelBgStyle: { fill: 'white' },
            });
          }
        });
      }
    });

    return { nodes, edges };
  }, [resources, changeMap]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when initialNodes/initialEdges change (e.g., when switching projects)
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onNodeClickHandler = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const resource = resources.find((r) => r.id === node.id);
      if (resource && onNodeClick) {
        onNodeClick(resource);
      }
    },
    [resources, onNodeClick]
  );

  return (
    <div className="w-full h-full relative">
      {/* Project Watermark */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project:</span>
            <span className="text-sm font-bold text-gray-900">{projectName}</span>
          </div>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClickHandler}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2, minZoom: 0.5, maxZoom: 1.5 }}
        minZoom={0.3}
        maxZoom={2}
        attributionPosition="bottom-left"
        elementsSelectable={true}
        nodesDraggable={true}
        nodesConnectable={false}
        zoomOnScroll={true}
        panOnScroll={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e5e7eb" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

