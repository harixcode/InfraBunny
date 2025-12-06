'use client';

import React from 'react';

interface Resource {
  id: string;
  resourceType: string;
  resourceName: string;
  resourceId: string;
  attributes: any;
  tags: any;
  dependencies: string[] | null;
}

interface ResourceDetailProps {
  resource: Resource;
  change?: any;
  onClose: () => void;
}

export default function ResourceDetail({ resource, change, onClose }: ResourceDetailProps) {
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return String(value);
  };

  const getChangeColor = (changeType?: string) => {
    if (changeType === 'added') return 'bg-green-100 border-green-500 text-green-800';
    if (changeType === 'modified') return 'bg-yellow-100 border-yellow-500 text-yellow-800';
    if (changeType === 'deleted') return 'bg-red-100 border-red-500 text-red-800';
    return 'bg-blue-100 border-blue-500 text-blue-800';
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl overflow-y-auto border-l border-gray-300 z-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Resource Details</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Resource Header */}
        <div className={`p-3 rounded-lg border-l-4 ${getChangeColor(change?.changeType)}`}>
          <div className="font-semibold text-sm">
            {resource.resourceType}.{resource.resourceName}
          </div>
          {change && (
            <div className="text-xs mt-1 font-medium uppercase">
              {change.changeType}
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div>
          <h3 className="font-semibold text-sm mb-2 text-gray-700">Basic Information</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-600">Type:</span>
              <span className="ml-2 text-gray-900">{resource.resourceType}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Name:</span>
              <span className="ml-2 text-gray-900">{resource.resourceName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">ID:</span>
              <span className="ml-2 text-gray-900 font-mono text-xs">{resource.resourceId}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {resource.tags && Object.keys(resource.tags).length > 0 && (
          <div>
            <h3 className="font-semibold text-sm mb-2 text-gray-700">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(resource.tags).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                >
                  <span className="font-medium">{key}:</span>
                  <span className="ml-1">{String(value)}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Configuration */}
        <div>
          <h3 className="font-semibold text-sm mb-2 text-gray-700">Configuration</h3>
          <div className="bg-gray-50 rounded p-3 space-y-2">
            {Object.entries(resource.attributes)
              .filter(([key]) => !['id', 'tags', 'arn'].includes(key))
              .slice(0, 10)
              .map(([key, value]) => (
                <div key={key} className="text-xs">
                  <div className="font-medium text-gray-600">{key}:</div>
                  <div className="text-gray-900 mt-1 font-mono break-all">
                    {formatValue(value)}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Dependencies */}
        {resource.dependencies && resource.dependencies.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm mb-2 text-gray-700">Dependencies</h3>
            <div className="space-y-1">
              {resource.dependencies.map((dep, index) => (
                <div key={index} className="text-xs bg-gray-100 rounded px-2 py-1 font-mono">
                  {dep}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Change Details */}
        {change && change.diff && (
          <div>
            <h3 className="font-semibold text-sm mb-2 text-gray-700">Changes</h3>
            <div className="space-y-3">
              {Object.keys(change.diff.added).length > 0 && (
                <div>
                  <div className="text-xs font-medium text-green-700 mb-1">Added:</div>
                  <div className="bg-green-50 rounded p-2 space-y-1">
                    {Object.entries(change.diff.added).map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="font-medium text-green-800">{key}:</span>
                        <span className="ml-1 text-green-900">{formatValue(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Object.keys(change.diff.modified).length > 0 && (
                <div>
                  <div className="text-xs font-medium text-yellow-700 mb-1">Modified:</div>
                  <div className="bg-yellow-50 rounded p-2 space-y-2">
                    {Object.entries(change.diff.modified).map(([key, value]: [string, any]) => (
                      <div key={key} className="text-xs">
                        <div className="font-medium text-yellow-800">{key}:</div>
                        <div className="ml-2 space-y-1">
                          <div className="text-red-700">- {formatValue(value.old)}</div>
                          <div className="text-green-700">+ {formatValue(value.new)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Object.keys(change.diff.removed).length > 0 && (
                <div>
                  <div className="text-xs font-medium text-red-700 mb-1">Removed:</div>
                  <div className="bg-red-50 rounded p-2 space-y-1">
                    {Object.entries(change.diff.removed).map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="font-medium text-red-800">{key}:</span>
                        <span className="ml-1 text-red-900">{formatValue(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

