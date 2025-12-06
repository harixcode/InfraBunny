'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ResourceGraph from '@/components/ResourceGraph';
import ResourceDetail from '@/components/ResourceDetail';
import ChangesPanel from '@/components/ChangesPanel';
import DriftAlert from '@/components/DriftAlert';
import DriftDetailModal from '@/components/DriftDetailModal';
import Logo from '@/components/Logo';
import { formatDistanceToNow, format, differenceInHours } from 'date-fns';

interface Project {
  name: string;
  snapshotCount: number;
  lastUpdated: string;
}

interface Snapshot {
  id: string;
  projectName: string;
  createdAt: string;
  _count?: {
    resources: number;
  };
}

interface Resource {
  id: string;
  resourceType: string;
  resourceName: string;
  resourceId: string;
  attributes: any;
  tags: any;
  dependencies: string[] | null;
}

interface SnapshotDetail extends Snapshot {
  resources: Resource[];
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState<SnapshotDetail | null>(null);
  const [compareSnapshot, setCompareSnapshot] = useState<Snapshot | null>(null);
  const [changes, setChanges] = useState<any[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectLoading, setProjectLoading] = useState(false);
  const [showChangesPanel, setShowChangesPanel] = useState(false);
  const [driftEvents, setDriftEvents] = useState<any[]>([]);
  const [allDriftEvents, setAllDriftEvents] = useState<any[]>([]);
  const [selectedDriftEvent, setSelectedDriftEvent] = useState<any>(null);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch snapshots when project is selected
  useEffect(() => {
    if (selectedProject) {
      // Immediately clear state and show loading
      setProjectLoading(true);
      setSelectedSnapshot(null);
      setCompareSnapshot(null);
      setChanges([]);
      setSelectedResource(null);
      setSnapshots([]);
      setDriftEvents([]);
      
      // Small delay to ensure state is cleared
      const timer = setTimeout(() => {
        fetchSnapshots(selectedProject);
        fetchDriftEvents(selectedProject);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [selectedProject]);

  // Load the latest snapshot when snapshots are loaded
  useEffect(() => {
    if (snapshots.length > 0 && !selectedSnapshot) {
      fetchSnapshotDetail(snapshots[0].id);
      // Only set compare snapshot if there are multiple snapshots
      if (snapshots.length > 1) {
        setCompareSnapshot(snapshots[1]);
      } else {
        // Ensure compareSnapshot is null if only one snapshot
        setCompareSnapshot(null);
      }
    }
  }, [snapshots, selectedSnapshot]);

  // Fetch changes when comparing snapshots
  useEffect(() => {
    if (compareSnapshot && selectedSnapshot && selectedSnapshot.projectName === compareSnapshot.projectName) {
      // Only fetch changes if both snapshots are from the same project
      fetchChanges(compareSnapshot.id, selectedSnapshot.id);
    } else {
      // Clear changes if no comparison or different projects
      setChanges([]);
    }
  }, [compareSnapshot, selectedSnapshot]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
      // Don't auto-select, let user choose
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setLoading(false);
    }
  };

  const fetchSnapshots = async (projectName: string) => {
    try {
      const res = await fetch(`/api/snapshots?project=${encodeURIComponent(projectName)}`);
      const data = await res.json();
      setSnapshots(data);
    } catch (error) {
      console.error('Failed to fetch snapshots:', error);
    } finally {
      setProjectLoading(false);
    }
  };

  const fetchSnapshotDetail = async (snapshotId: string) => {
    try {
      const res = await fetch(`/api/snapshots/${snapshotId}`);
      const data = await res.json();
      setSelectedSnapshot(data);
    } catch (error) {
      console.error('Failed to fetch snapshot detail:', error);
    }
  };

  const fetchChanges = async (fromId: string, toId: string) => {
    try {
      const res = await fetch(`/api/compare?from=${fromId}&to=${toId}`);
      const data = await res.json();
      setChanges(data.changes || []);
    } catch (error) {
      console.error('Failed to fetch changes:', error);
    }
  };

  const fetchDriftEvents = async (projectName: string) => {
    try {
      // Fetch open events
      const openRes = await fetch(`/api/drift?project=${encodeURIComponent(projectName)}&status=open`);
      const openData = await openRes.json();
      // Ensure it's an array
      setDriftEvents(Array.isArray(openData) ? openData : []);
      
      // Fetch all events (for history)
      const allRes = await fetch(`/api/drift?project=${encodeURIComponent(projectName)}`);
      const allData = await allRes.json();
      // Ensure it's an array
      setAllDriftEvents(Array.isArray(allData) ? allData : []);
    } catch (error) {
      console.error('Failed to fetch drift events:', error);
      // Set empty arrays on error
      setDriftEvents([]);
      setAllDriftEvents([]);
    }
  };

  const handleAcknowledgeDrift = async (id: string) => {
    try {
      await fetch('/api/drift', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          acknowledgedBy: 'admin@company.com',
        }),
      });
      // Refresh drift events
      if (selectedProject) {
        fetchDriftEvents(selectedProject);
      }
    } catch (error) {
      console.error('Failed to acknowledge drift:', error);
    }
  };

  const handleAcknowledgeAllDrift = async (ids: string[]) => {
    try {
      // Acknowledge all events in parallel
      await Promise.all(
        ids.map(id =>
          fetch('/api/drift', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id,
              acknowledgedBy: 'admin@company.com',
            }),
          })
        )
      );
      // Refresh drift events
      if (selectedProject) {
        fetchDriftEvents(selectedProject);
      }
    } catch (error) {
      console.error('Failed to acknowledge all drift events:', error);
    }
  };

  const handleViewDriftDetails = (event: any) => {
    setSelectedDriftEvent(event);
  };

  const handleSnapshotChange = (snapshotId: string) => {
    fetchSnapshotDetail(snapshotId);
    setSelectedResource(null);
    
    // Automatically set comparison to the next older version
    const currentIndex = snapshots.findIndex(s => s.id === snapshotId);
    if (currentIndex >= 0 && currentIndex < snapshots.length - 1) {
      // Set compare to the next snapshot (older version)
      setCompareSnapshot(snapshots[currentIndex + 1]);
    } else {
      // If it's the oldest snapshot, clear comparison
      setCompareSnapshot(null);
    }
  };

  const handleNodeClick = (resource: Resource) => {
    setSelectedResource(resource);
  };

  const handleCloseDetail = () => {
    setSelectedResource(null);
  };

  const getChangeForResource = (resource: Resource) => {
    if (!changes.length) return undefined;
    const address = `${resource.resourceType}.${resource.resourceName}`;
    return changes.find((c) => c.address === address);
  };

  const handleResourceClickFromChanges = (address: string) => {
    // Find the resource by address
    const [type, name] = address.split('.');
    const resource = selectedSnapshot?.resources.find(
      (r) => r.resourceType === type && r.resourceName === name
    );
    if (resource) {
      setSelectedResource(resource);
      setShowChangesPanel(false);
    }
  };

  // Get unique resource types in current project
  // Format timestamp: relative if < 24h, absolute if older
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const hoursAgo = differenceInHours(new Date(), date);
    
    if (hoursAgo < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, 'MMM d, yyyy \'at\' h:mm a');
    }
  };

  const getResourceTypesInProject = () => {
    if (!selectedSnapshot?.resources) return [];
    
    const typeMap = new Map<string, { icon: string; color: string; label: string }>();
    
    selectedSnapshot.resources.forEach((resource) => {
      const type = resource.resourceType;
      
      if (type.includes('vpc')) {
        typeMap.set('vpc', { icon: '🌐', color: '#bfdbfe', label: 'VPC' });
      } else if (type.includes('subnet')) {
        typeMap.set('subnet', { icon: '🔌', color: '#ddd6fe', label: 'Subnet' });
      } else if (type.includes('instance') || type.includes('ec2')) {
        typeMap.set('ec2', { icon: '🖥️', color: '#fecaca', label: 'EC2' });
      } else if (type.includes('db') || type.includes('rds')) {
        typeMap.set('db', { icon: '🗄️', color: '#c7d2fe', label: 'Database' });
      } else if (type.includes('s3')) {
        typeMap.set('s3', { icon: '📦', color: '#bbf7d0', label: 'S3' });
      } else if (type.includes('security_group')) {
        typeMap.set('security_group', { icon: '🛡️', color: '#fed7aa', label: 'Security Group' });
      } else if (type.includes('lb') || type.includes('load_balancer') || type.includes('elb') || type.includes('alb')) {
        typeMap.set('lb', { icon: '⚖️', color: '#fde68a', label: 'Load Balancer' });
      } else if (type.includes('lambda')) {
        typeMap.set('lambda', { icon: '⚡', color: '#fef08a', label: 'Lambda' });
      } else if (type.includes('dynamodb')) {
        typeMap.set('dynamodb', { icon: '📊', color: '#e9d5ff', label: 'DynamoDB' });
      } else if (type.includes('api_gateway')) {
        typeMap.set('api_gateway', { icon: '🔗', color: '#bae6fd', label: 'API Gateway' });
      } else if (type.includes('iam')) {
        typeMap.set('iam', { icon: '🔑', color: '#fecdd3', label: 'IAM' });
      }
    });
    
    return Array.from(typeMap.values());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo size={80} />
          </div>
          <div className="text-xl font-semibold text-gray-700">Loading InfraBunny...</div>
        </div>
      </div>
    );
  }

  // Loading spinner for project switch
  const renderLoadingSpinner = () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading {selectedProject}...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
              <Logo size={48} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">InfraBunny</h1>
                <p className="text-sm text-gray-600">Cloud Resource Visualization</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              {/* Drift Indicator */}
              {selectedProject && driftEvents.length > 0 && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                  <svg className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-orange-800">
                      {driftEvents.length} Drift Event{driftEvents.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-orange-600">
                      Requires attention
                    </span>
                  </div>
                </div>
              )}
              <a
                href="/admin"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Admin Panel"
              >
                <span className="text-xl">⚙️</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Project Selector */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Projects</h2>
              <div className="space-y-2">
                {projects.map((project) => (
                  <button
                    key={project.name}
                    onClick={() => setSelectedProject(project.name)}
                    disabled={projectLoading}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedProject === project.name
                        ? 'bg-blue-100 text-blue-900 font-medium'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    } ${projectLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="font-medium">{project.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {project.snapshotCount} snapshot{project.snapshotCount !== 1 ? 's' : ''}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Drift Events Alert */}
            {selectedProject && allDriftEvents.length > 0 && (
              <DriftAlert
                driftEvents={driftEvents}
                allDriftEvents={allDriftEvents}
                onAcknowledge={handleAcknowledgeDrift}
                onAcknowledgeAll={handleAcknowledgeAllDrift}
                onViewDetails={handleViewDriftDetails}
              />
            )}

            {/* Snapshot History */}
            {snapshots.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-2">Version History</h2>
                <div className="space-y-2">
                  {snapshots.map((snapshot, index) => {
                    const isSelected = selectedSnapshot?.id === snapshot.id;
                    const isComparing = compareSnapshot?.id === snapshot.id;
                    
                    return (
                      <button
                        key={snapshot.id}
                        onClick={() => handleSnapshotChange(snapshot.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                          isSelected
                            ? 'bg-blue-50 border-blue-300'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-medium text-gray-700">
                            {index === 0 ? '● Current' : `○ Version ${snapshots.length - index}`}
                          </div>
                          <div className="flex gap-1">
                            {isSelected && (
                              <div className="text-xs font-semibold text-blue-600">Viewing</div>
                            )}
                            {isComparing && !isSelected && (
                              <div className="text-xs font-semibold text-yellow-600">Comparing</div>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTimestamp(snapshot.createdAt)}
                        </div>
                        {snapshot._count && (
                          <div className="text-xs text-gray-500 mt-1">
                            {snapshot._count.resources} resources
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Compare Mode */}
            {snapshots.length > 1 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-2">Compare With</h2>
                <select
                  value={compareSnapshot?.id || ''}
                  onChange={(e) => {
                    const snapshot = snapshots.find((s) => s.id === e.target.value);
                    setCompareSnapshot(snapshot || null);
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                >
                  <option value="">No comparison</option>
                  {snapshots
                    .filter((s) => s.id !== selectedSnapshot?.id)
                    .map((snapshot, index) => (
                      <option key={snapshot.id} value={snapshot.id}>
                        {formatTimestamp(snapshot.createdAt)}
                      </option>
                    ))}
                </select>

                {changes.length > 0 && (
                  <button
                    onClick={() => setShowChangesPanel(true)}
                    className="mt-3 w-full p-3 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg transition-colors text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-semibold text-yellow-900">
                        {changes.length} Change{changes.length !== 1 ? 's' : ''} Detected
                      </div>
                      <div className="text-yellow-700 text-xs">
                        Click to view →
                      </div>
                    </div>
                    <div className="space-y-1">
                      {changes.filter((c) => c.changeType === 'added').length > 0 && (
                        <div className="text-xs text-green-700">
                          + {changes.filter((c) => c.changeType === 'added').length} added
                        </div>
                      )}
                      {changes.filter((c) => c.changeType === 'modified').length > 0 && (
                        <div className="text-xs text-yellow-700">
                          ~ {changes.filter((c) => c.changeType === 'modified').length} modified
                        </div>
                      )}
                      {changes.filter((c) => c.changeType === 'deleted').length > 0 && (
                        <div className="text-xs text-red-700">
                          - {changes.filter((c) => c.changeType === 'deleted').length} deleted
                        </div>
                      )}
                    </div>
                  </button>
                )}
              </div>
            )}

            {/* Legend - Only show when project is selected */}
            {selectedProject && selectedSnapshot && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Legend</h2>
                
                {/* Change Status - Only show if comparing versions */}
                {changes.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-600 mb-1">Changes:</div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded border-2 border-green-400" style={{ borderWidth: '3px' }}></div>
                        <span className="text-gray-700">Added</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded border-2 border-yellow-400" style={{ borderWidth: '3px' }}></div>
                        <span className="text-gray-700">Modified</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded border-2 border-red-400" style={{ borderWidth: '3px' }}></div>
                        <span className="text-gray-700">Deleted</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resource Types - Dynamic based on current project */}
                {getResourceTypesInProject().length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">Resource Types:</div>
                    <div className="space-y-1.5 text-xs">
                      {getResourceTypesInProject().map((type) => (
                        <div key={type.label} className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: type.color }}></div>
                          <span className="text-gray-700">{type.icon} {type.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Graph Area */}
        <div className="flex-1 relative">
          {projectLoading ? (
            renderLoadingSpinner()
          ) : !selectedProject ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <Logo size={120} />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">Welcome to InfraBunny</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Visualize your cloud infrastructure with interactive diagrams and track changes across versions
                </p>
                <div className="inline-flex items-center space-x-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className="font-medium">Select a project from the sidebar to begin</span>
                </div>
              </div>
            </div>
          ) : selectedSnapshot && selectedSnapshot.resources.length > 0 ? (
            <ResourceGraph
              resources={selectedSnapshot.resources}
              changes={changes}
              onNodeClick={handleNodeClick}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">📊</div>
                <div className="text-lg">No resources to display</div>
                <div className="text-sm mt-2">This project has no resources</div>
              </div>
            </div>
          )}
        </div>

        {/* Resource Detail Panel */}
        {selectedResource && (
          <ResourceDetail
            resource={selectedResource}
            change={getChangeForResource(selectedResource)}
            onClose={handleCloseDetail}
          />
        )}
      </div>

      {/* Changes Panel Modal */}
      {showChangesPanel && (
        <ChangesPanel
          changes={changes}
          onClose={() => setShowChangesPanel(false)}
          onResourceClick={handleResourceClickFromChanges}
        />
      )}

      {/* Drift Detail Modal */}
      <DriftDetailModal
        event={selectedDriftEvent}
        onClose={() => setSelectedDriftEvent(null)}
      />
    </div>
  );
}

