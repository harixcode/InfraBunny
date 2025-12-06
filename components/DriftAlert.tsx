'use client';

import React, { useState } from 'react';
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
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

interface DriftAlertProps {
  driftEvents: DriftEvent[];
  allDriftEvents: DriftEvent[];
  onAcknowledge: (id: string) => void;
  onAcknowledgeAll: (ids: string[]) => void;
  onViewDetails: (event: DriftEvent) => void;
}

export default function DriftAlert({ driftEvents, allDriftEvents, onAcknowledge, onAcknowledgeAll, onViewDetails }: DriftAlertProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Ensure we're working with arrays
  const safeDriftEvents = Array.isArray(driftEvents) ? driftEvents : [];
  const safeAllDriftEvents = Array.isArray(allDriftEvents) ? allDriftEvents : [];
  
  const openEvents = safeDriftEvents.filter(e => e.status === 'open');
  const acknowledgedEvents = safeAllDriftEvents.filter(e => e.status === 'acknowledged');
  const displayEvents = showHistory ? safeAllDriftEvents : openEvents;

  const handleAcknowledgeAll = () => {
    const ids = openEvents.map(e => e.id);
    onAcknowledgeAll(ids);
    setShowConfirmModal(false);
  };

  const getChangeIcon = (changeType: string) => {
    if (changeType.includes('security')) return '🛡️';
    if (changeType.includes('tag')) return '🏷️';
    if (changeType.includes('config')) return '⚙️';
    if (changeType.includes('network')) return '🌐';
    if (changeType.includes('storage')) return '💾';
    if (changeType.includes('public')) return '🌍';
    if (changeType.includes('backup')) return '🔄';
    return '⚠️';
  };

  const getChangeTypeLabel = (changeType: string) => {
    return changeType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getResourceTypeLabel = (resourceType: string) => {
    return resourceType.replace('aws_', '').toUpperCase();
  };

  // Show nothing if no events at all
  if (safeAllDriftEvents.length === 0) {
    return null;
  }

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <svg className="h-4 w-4 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <h3 className="text-xs font-semibold text-orange-800">
            {showHistory ? 'Drift History' : `${openEvents.length} Drift Event${openEvents.length !== 1 ? 's' : ''}`}
          </h3>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-xs text-orange-600 hover:text-orange-700 font-medium"
        >
          {showHistory ? 'Active Only' : 'View All'}
        </button>
      </div>
      
      {displayEvents.length === 0 ? (
        <div className="text-xs text-gray-500 text-center py-2">
          {showHistory ? 'No drift events yet' : '✅ No active drift events'}
        </div>
      ) : (
        <div className="space-y-2">
          {displayEvents.map((event) => (
            <div 
              key={event.id} 
              className={`rounded-md p-2 border ${
                event.status === 'acknowledged' 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-white border-orange-100'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-base">{getChangeIcon(event.changeType)}</span>
                    <span className={`text-xs font-semibold uppercase tracking-wide ${
                      event.status === 'acknowledged' ? 'text-gray-500' : 'text-gray-700'
                    }`}>
                      {getResourceTypeLabel(event.resourceType)}
                    </span>
                    {event.status === 'acknowledged' && (
                      <span className="text-xs text-green-600 font-bold">✓</span>
                    )}
                  </div>
                  <div className={`text-xs font-medium ${
                    event.status === 'acknowledged' ? 'text-gray-500' : 'text-orange-700'
                  }`}>
                    {getChangeTypeLabel(event.changeType)}
                  </div>
                </div>
                <button
                  onClick={() => onViewDetails(event)}
                  className={`flex-shrink-0 text-xs px-2.5 py-1 rounded transition-colors whitespace-nowrap font-medium ${
                    event.status === 'acknowledged'
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                  }`}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!showHistory && openEvents.length > 0 && (
        <button
          onClick={() => setShowConfirmModal(true)}
          className="w-full mt-2 text-xs bg-white hover:bg-gray-50 text-orange-700 border border-orange-200 px-2 py-1.5 rounded transition-colors"
        >
          Acknowledge All ({openEvents.length})
        </button>
      )}
      
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <svg className="h-6 w-6 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Acknowledge All Drift Events?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              You are about to acknowledge <span className="font-semibold">{openEvents.length} drift event{openEvents.length !== 1 ? 's' : ''}</span>. 
              This will mark them as reviewed and move them to history.
            </p>
            <div className="space-y-2 mb-6 max-h-40 overflow-y-auto">
              {openEvents.map((event) => (
                <div key={event.id} className="text-xs text-gray-700 bg-gray-50 rounded p-2">
                  • {event.resourceName} - {event.changeType.replace(/_/g, ' ')}
                </div>
              ))}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAcknowledgeAll}
                className="flex-1 px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Acknowledge All
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showHistory && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          {openEvents.length} active, {acknowledgedEvents.length} acknowledged
        </div>
      )}
    </div>
  );
}

