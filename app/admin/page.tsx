'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Project {
  name: string;
}

interface Resource {
  id: string;
  resourceType: string;
  resourceName: string;
  resourceId: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  
  const [formData, setFormData] = useState({
    modifiedBy: 'bob@company.com',
    changeType: 'security_group_modified',
    changeDescription: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchResources(selectedProject);
    }
  }, [selectedProject]);

  // Auto-update change description when change type changes
  useEffect(() => {
    if (selectedResource && formData.changeType) {
      const types = getChangeTypesForResource(selectedResource.resourceType);
      const selectedType = types.find(t => t.value === formData.changeType);
      if (selectedType && selectedType.desc) {
        setFormData(prev => ({ ...prev, changeDescription: selectedType.desc }));
      }
    }
  }, [formData.changeType, selectedResource]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
      if (data.length > 0) {
        setSelectedProject(data[0].name);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const fetchResources = async (projectName: string) => {
    try {
      const res = await fetch(`/api/snapshots?project=${encodeURIComponent(projectName)}`);
      const snapshots = await res.json();
      
      if (snapshots.length > 0) {
        const latestSnapshot = snapshots[0];
        const detailRes = await fetch(`/api/snapshots/${latestSnapshot.id}`);
        const detail = await detailRes.json();
        setResources(detail.resources);
        setSelectedResource(detail.resources[0] || null);
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    }
  };

  const handleSimulateDrift = async () => {
    if (!selectedResource) {
      setMessage({ type: 'error', text: 'Please select a resource' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const changeDetail = {
        description: formData.changeDescription,
        timestamp: new Date().toISOString(),
        previousState: 'Unknown (not tracked)',
        newState: 'Modified via Console',
      };

      const res = await fetch('/api/drift/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: selectedProject,
          resourceType: selectedResource.resourceType,
          resourceName: selectedResource.resourceName,
          resourceId: selectedResource.resourceId,
          modifiedBy: formData.modifiedBy,
          changeType: formData.changeType,
          changeDetail,
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: '✅ Drift event created successfully!' });
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: 'Failed to create drift event' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  // Get smart suggestions based on resource type
  const getChangeTypesForResource = (resourceType: string) => {
    const type = resourceType.toLowerCase();
    
    if (type.includes('instance') || type.includes('ec2')) {
      return [
        { value: 'security_group_modified', label: 'Security Group Modified', desc: 'Added SSH rule allowing 0.0.0.0/0:22' },
        { value: 'instance_type_changed', label: 'Instance Type Changed', desc: 'Changed from t3.micro to t3.large (3x cost increase)' },
        { value: 'tag_removed', label: 'Tag Removed', desc: 'Removed CostCenter tag' },
        { value: 'public_ip_enabled', label: 'Public IP Enabled', desc: 'Enabled auto-assign public IP' },
      ];
    } else if (type.includes('security_group') || type.includes('sg')) {
      return [
        { value: 'network_rule_added', label: 'Inbound Rule Added', desc: 'Allowed 0.0.0.0/0 on port 22 (SSH)' },
        { value: 'network_rule_added', label: 'Outbound Rule Changed', desc: 'Modified egress rules to allow all traffic' },
        { value: 'security_group_modified', label: 'Rule Modified', desc: 'Changed source from specific IP to 0.0.0.0/0' },
      ];
    } else if (type.includes('db') || type.includes('rds')) {
      return [
        { value: 'storage_resized', label: 'Storage Increased', desc: 'Increased storage from 100GB to 500GB (+$150/month)' },
        { value: 'instance_type_changed', label: 'Instance Class Changed', desc: 'Changed from db.t3.micro to db.r5.large' },
        { value: 'backup_disabled', label: 'Backup Window Changed', desc: 'Modified backup window to business hours' },
        { value: 'public_access_enabled', label: 'Public Access Enabled', desc: 'Enabled publicly accessible flag' },
      ];
    } else if (type.includes('s3')) {
      return [
        { value: 'bucket_public', label: 'Bucket Made Public', desc: 'Disabled block public access' },
        { value: 'encryption_disabled', label: 'Encryption Disabled', desc: 'Removed default encryption' },
        { value: 'versioning_disabled', label: 'Versioning Disabled', desc: 'Turned off versioning' },
        { value: 'tag_removed', label: 'Tag Removed', desc: 'Removed compliance tags' },
      ];
    } else if (type.includes('lb') || type.includes('load_balancer')) {
      return [
        { value: 'listener_modified', label: 'Listener Modified', desc: 'Changed HTTP to HTTPS redirect rule' },
        { value: 'target_group_changed', label: 'Target Group Changed', desc: 'Modified health check settings' },
        { value: 'security_group_modified', label: 'Security Group Modified', desc: 'Attached additional security group' },
      ];
    } else if (type.includes('lambda')) {
      return [
        { value: 'memory_increased', label: 'Memory Increased', desc: 'Increased memory from 128MB to 1024MB' },
        { value: 'timeout_changed', label: 'Timeout Changed', desc: 'Increased timeout from 3s to 15 minutes' },
        { value: 'env_var_modified', label: 'Environment Variable Changed', desc: 'Modified DATABASE_URL env variable' },
      ];
    } else if (type.includes('vpc')) {
      return [
        { value: 'cidr_added', label: 'CIDR Block Added', desc: 'Added secondary CIDR block' },
        { value: 'dns_modified', label: 'DNS Settings Changed', desc: 'Enabled DNS hostnames' },
        { value: 'tag_modified', label: 'Tag Modified', desc: 'Changed Environment tag value' },
      ];
    } else if (type.includes('subnet')) {
      return [
        { value: 'auto_assign_ip', label: 'Auto-assign IP Enabled', desc: 'Enabled auto-assign public IPv4' },
        { value: 'route_table_changed', label: 'Route Table Changed', desc: 'Associated with different route table' },
        { value: 'tag_removed', label: 'Tag Removed', desc: 'Removed Tier tag' },
      ];
    }
    
    // Default for unknown types
    return [
      { value: 'config_changed', label: 'Configuration Changed', desc: 'Modified resource configuration' },
      { value: 'tag_added', label: 'Tag Added', desc: 'Added new tags' },
      { value: 'tag_removed', label: 'Tag Removed', desc: 'Removed tags' },
    ];
  };

  const changeTypes = selectedResource 
    ? getChangeTypesForResource(selectedResource.resourceType)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🐰</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">InfraBunny Admin</h1>
                <p className="text-sm text-gray-600">Drift Detection Simulator</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Simulate AWS Console Change
            </h2>
            <p className="text-sm text-gray-600">
              Create a simulated drift event to demonstrate how InfraBunny detects manual changes
              made outside of Terraform.
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="space-y-6">
            {/* Project Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
              >
                {projects.map((project) => (
                  <option key={project.name} value={project.name}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Resource Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource
              </label>
              <select
                value={selectedResource?.id || ''}
                onChange={(e) => {
                  const resource = resources.find((r) => r.id === e.target.value);
                  setSelectedResource(resource || null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
              >
                {resources.map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.resourceType} - {resource.resourceName} ({resource.resourceId})
                  </option>
                ))}
              </select>
            </div>

            {/* Modified By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modified By (User Email)
              </label>
              <input
                type="email"
                value={formData.modifiedBy}
                onChange={(e) => setFormData({ ...formData, modifiedBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                placeholder="bob@company.com"
              />
            </div>

            {/* Change Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Change Type (Smart suggestions based on resource)
              </label>
              <select
                value={formData.changeType}
                onChange={(e) => setFormData({ ...formData, changeType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
              >
                {changeTypes.length > 0 ? (
                  changeTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))
                ) : (
                  <option>Select a resource first</option>
                )}
              </select>
            </div>

            {/* Change Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Change Description
                <span className="ml-2 text-xs text-gray-500">(Auto-filled based on change type)</span>
              </label>
              <textarea
                value={formData.changeDescription}
                onChange={(e) => setFormData({ ...formData, changeDescription: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                placeholder="Describe what was changed..."
              />
              <p className="mt-1 text-xs text-gray-500">
                💡 Tip: This auto-updates when you select a change type
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateDrift}
                disabled={loading || !selectedResource}
                className={`px-6 py-2 text-white rounded-lg transition-colors ${
                  loading || !selectedResource
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {loading ? 'Creating...' : '⚠️ Simulate Drift Event'}
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How This Works
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 ml-7">
            <li>• This simulates someone making a manual change in AWS Console</li>
            <li>• In production, this would be detected automatically via CloudTrail</li>
            <li>• The drift event will appear on the main dashboard</li>
            <li>• Management will see who made the change, when, and what was modified</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

