'use client';

import React from 'react';

interface Change {
  address: string;
  changeType: string;
  resource?: any;
  diff?: {
    added: Record<string, any>;
    modified: Record<string, any>;
    removed: Record<string, any>;
  };
}

interface ChangesPanelProps {
  changes: Change[];
  onClose: () => void;
  onResourceClick: (address: string) => void;
}

export default function ChangesPanel({ changes, onClose, onResourceClick }: ChangesPanelProps) {
  const addedChanges = changes.filter(c => c.changeType === 'added');
  const modifiedChanges = changes.filter(c => c.changeType === 'modified');
  const deletedChanges = changes.filter(c => c.changeType === 'deleted');

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return String(value);
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
    if (resourceType.includes('lb') || resourceType.includes('load')) return '⚖️';
    return '📋';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Changes Summary</h2>
            <p className="text-blue-100 text-sm mt-1">
              {changes.length} change{changes.length !== 1 ? 's' : ''} detected
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center text-2xl transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* Added Resources */}
          {addedChanges.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Added Resources ({addedChanges.length})
                </h3>
              </div>
              <div className="space-y-2">
                {addedChanges.map((change, idx) => {
                  const [type, name] = change.address.split('.');
                  return (
                    <button
                      key={idx}
                      onClick={() => onResourceClick(change.address)}
                      className="w-full text-left bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getResourceIcon(type)}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-green-900">{name}</div>
                          <div className="text-sm text-green-700">{type}</div>
                        </div>
                        <div className="text-green-600 text-sm font-medium">NEW</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Modified Resources */}
          {modifiedChanges.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Modified Resources ({modifiedChanges.length})
                </h3>
              </div>
              <div className="space-y-3">
                {modifiedChanges.map((change, idx) => {
                  const [type, name] = change.address.split('.');
                  const diff = change.diff;
                  const totalChanges = 
                    Object.keys(diff?.added || {}).length +
                    Object.keys(diff?.modified || {}).length +
                    Object.keys(diff?.removed || {}).length;

                  return (
                    <button
                      key={idx}
                      onClick={() => onResourceClick(change.address)}
                      className="w-full text-left bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg p-4 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getResourceIcon(type)}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-yellow-900">{name}</div>
                          <div className="text-sm text-yellow-700">{type}</div>
                        </div>
                        <div className="text-yellow-600 text-sm font-medium">
                          {totalChanges} change{totalChanges !== 1 ? 's' : ''}
                        </div>
                      </div>
                      
                      {/* Quick preview of changes */}
                      <div className="ml-11 space-y-1 text-xs">
                        {diff?.added && Object.keys(diff.added).length > 0 && (
                          <div className="text-green-700">
                            + Added: {Object.keys(diff.added).slice(0, 3).join(', ')}
                            {Object.keys(diff.added).length > 3 && ` +${Object.keys(diff.added).length - 3} more`}
                          </div>
                        )}
                        {diff?.modified && Object.keys(diff.modified).length > 0 && (
                          <div className="text-orange-700">
                            ~ Modified: {Object.keys(diff.modified).slice(0, 3).join(', ')}
                            {Object.keys(diff.modified).length > 3 && ` +${Object.keys(diff.modified).length - 3} more`}
                          </div>
                        )}
                        {diff?.removed && Object.keys(diff.removed).length > 0 && (
                          <div className="text-red-700">
                            - Removed: {Object.keys(diff.removed).slice(0, 3).join(', ')}
                            {Object.keys(diff.removed).length > 3 && ` +${Object.keys(diff.removed).length - 3} more`}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Deleted Resources */}
          {deletedChanges.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Deleted Resources ({deletedChanges.length})
                </h3>
              </div>
              <div className="space-y-2">
                {deletedChanges.map((change, idx) => {
                  const [type, name] = change.address.split('.');
                  return (
                    <div
                      key={idx}
                      className="bg-red-50 border border-red-200 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl opacity-50">{getResourceIcon(type)}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-red-900 line-through">{name}</div>
                          <div className="text-sm text-red-700">{type}</div>
                        </div>
                        <div className="text-red-600 text-sm font-medium">DELETED</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {changes.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">✨</div>
              <div className="text-lg">No changes detected</div>
              <div className="text-sm mt-2">All resources are unchanged</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Click on any resource to view detailed changes
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

