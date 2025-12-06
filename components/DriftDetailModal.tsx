'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface DriftEvent {
  id: string;
  projectName: string;
  resourceType: string;
  resourceName: string;
  resourceId: string;
  detectedAt: string;
  modifiedBy: string;
  modifiedVia: string;
  changeType: string;
  changeDetail: any;
  status: string;
}

interface DriftDetailModalProps {
  event: DriftEvent | null;
  onClose: () => void;
}

export default function DriftDetailModal({ event, onClose }: DriftDetailModalProps) {
  if (!event) return null;

  const getChangeIcon = (changeType: string) => {
    if (changeType.includes('security')) return '🛡️';
    if (changeType.includes('tag')) return '🏷️';
    if (changeType.includes('config')) return '⚙️';
    if (changeType.includes('network')) return '🌐';
    return '⚠️';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-orange-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getChangeIcon(event.changeType)}</span>
            <h2 className="text-xl font-semibold">Drift Event Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Resource Info */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Resource Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">Type:</span>
                <span className="text-gray-900">{event.resourceType}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">Name:</span>
                <span className="text-gray-900">{event.resourceName}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">Resource ID:</span>
                <span className="text-gray-900 font-mono text-xs">{event.resourceId}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">Project:</span>
                <span className="text-gray-900">{event.projectName}</span>
              </div>
            </div>
          </div>

          {/* Change Info */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Change Information</h3>
            <div className="bg-orange-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">Modified By:</span>
                <span className="text-gray-900">{event.modifiedBy}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">Modified Via:</span>
                <span className="text-gray-900 capitalize">{event.modifiedVia}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">Detected:</span>
                <span className="text-gray-900">
                  {formatDistanceToNow(new Date(event.detectedAt), { addSuffix: true })}
                </span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">Change Type:</span>
                <span className="text-gray-900">
                  {event.changeType.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Change Details */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">What Changed</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {event.changeDetail && typeof event.changeDetail === 'object' ? (
                <>
                  {event.changeDetail.description && (
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-1">Description:</div>
                      <div className="text-sm text-gray-900">{event.changeDetail.description}</div>
                    </div>
                  )}
                  {event.changeDetail.timestamp && (
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-1">Timestamp:</div>
                      <div className="text-xs text-gray-700 font-mono">
                        {new Date(event.changeDetail.timestamp).toLocaleString()}
                      </div>
                    </div>
                  )}
                  {event.changeDetail.previousState && (
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-1">Previous State:</div>
                      <div className="text-sm text-gray-700">{event.changeDetail.previousState}</div>
                    </div>
                  )}
                  {event.changeDetail.newState && (
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-1">New State:</div>
                      <div className="text-sm text-gray-700">{event.changeDetail.newState}</div>
                    </div>
                  )}
                  {/* Raw JSON for debugging */}
                  <details className="mt-3">
                    <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                      View raw data
                    </summary>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono mt-2 p-2 bg-gray-100 rounded">
                      {JSON.stringify(event.changeDetail, null, 2)}
                    </pre>
                  </details>
                </>
              ) : (
                <div className="text-sm text-gray-700">
                  {event.changeDetail || 'No change details available'}
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recommended Actions
            </h3>
            <ul className="text-sm text-blue-800 space-y-1 ml-7">
              <li>• Review the change to ensure it aligns with infrastructure policies</li>
              <li>• Update Terraform configuration to reflect this change</li>
              <li>• Or revert the change in AWS Console to maintain infrastructure as code</li>
              <li>• Consider implementing change approval workflows</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              className="px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
              onClick={onClose}
            >
              Mark as Acknowledged
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

