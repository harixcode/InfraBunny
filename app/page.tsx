'use client';

import React, { useState, useEffect } from 'react';
import ResourceGraph from '@/components/ResourceGraph';
import ResourceDetail from '@/components/ResourceDetail';
import ChangesPanel from '@/components/ChangesPanel';
import { formatDistanceToNow } from 'date-fns';

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
  const [showChangesPanel, setShowChangesPanel] = useState(false);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch snapshots when project is selected
  useEffect(() => {
    if (selectedProject) {
      // Reset state when switching projects
      setSelectedSnapshot(null);
      setCompareSnapshot(null);
      setChanges([]);
      setSelectedResource(null);
      fetchSnapshots(selectedProject);
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
      if (data.length > 0) {
        setSelectedProject(data[0].name);
      }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">🐰</div>
          <div className="text-xl font-semibold text-gray-700">Loading InfraBunny...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🐰</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">InfraBunny</h1>
                <p className="text-sm text-gray-600">Cloud Resource Visualization</p>
              </div>
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
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedProject === project.name
                        ? 'bg-blue-100 text-blue-900 font-medium'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">{project.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {project.snapshotCount} snapshot{project.snapshotCount !== 1 ? 's' : ''}
                    </div>
                  </button>
                ))}
              </div>
            </div>

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
                          {formatDistanceToNow(new Date(snapshot.createdAt), { addSuffix: true })}
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
                        {formatDistanceToNow(new Date(snapshot.createdAt), { addSuffix: true })}
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

            {/* Legend */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Color Legend</h2>
              
              {/* Change Status */}
              <div className="mb-3">
                <div className="text-xs font-medium text-gray-600 mb-1">Changes:</div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#86efac' }}></div>
                    <span className="text-gray-700">Added</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fbbf24' }}></div>
                    <span className="text-gray-700">Modified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f87171' }}></div>
                    <span className="text-gray-700">Deleted</span>
                  </div>
                </div>
              </div>

              {/* Resource Types */}
              <div>
                <div className="text-xs font-medium text-gray-600 mb-1">Resource Types:</div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#bfdbfe' }}></div>
                    <span className="text-gray-700">🌐 VPC</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ddd6fe' }}></div>
                    <span className="text-gray-700">🔌 Subnet</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fecaca' }}></div>
                    <span className="text-gray-700">🖥️ EC2</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#c7d2fe' }}></div>
                    <span className="text-gray-700">🗄️ Database</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#bbf7d0' }}></div>
                    <span className="text-gray-700">📦 S3</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fed7aa' }}></div>
                    <span className="text-gray-700">🛡️ Security</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Graph Area */}
        <div className="flex-1 relative">
          {selectedSnapshot && selectedSnapshot.resources.length > 0 ? (
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
                <div className="text-sm mt-2">Select a project with resources</div>
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
    </div>
  );
}

