'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import VisitorService from '@/Services/visitorService';
import { AlertTriangle, Loader, X, Check } from 'lucide-react';

export default function FlaggedVisitorsPage() {
  const [flaggedVisitors, setFlaggedVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolving, setResolving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadFlaggedVisitors();
  }, []);

  const loadFlaggedVisitors = async () => {
    try {
      setLoading(true);
      const flags = await VisitorService.getFlaggedVisitors();
      setFlaggedVisitors(flags || []);
    } catch (err) {
      setError('Failed to load flagged visitors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveClick = (flag) => {
    setSelectedFlag(flag);
    setResolutionNotes('');
    setShowModal(true);
  };

  const handleResolveFlag = async () => {
    if (!selectedFlag) return;

    setResolving(true);
    try {
      await VisitorService.resolveFlag(selectedFlag._id, resolutionNotes);
      setSuccessMessage(`Flag for ${selectedFlag.visitorName} has been resolved`);
      setShowModal(false);
      setSelectedFlag(null);
      
      setTimeout(() => {
        loadFlaggedVisitors();
        setSuccessMessage('');
      }, 1500);
    } catch (err) {
      setError('Failed to resolve flag');
      console.error(err);
    } finally {
      setResolving(false);
    }
  };

  const activeFlags = flaggedVisitors.filter(f => f.status === 'flagged');
  const resolvedFlags = flaggedVisitors.filter(f => f.status === 'resolved');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="security" />
      
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Flagged Visitors</h1>
                <p className="text-gray-600 text-sm mt-1">View and resolve flags placed on visitors for suspicious activity</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-700">{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <X className="w-5 h-5 text-red-600" />
              <span className="text-red-700">{error}</span>
              <button onClick={() => setError('')} className="ml-auto text-red-700">×</button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {/* Active Flags */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  Active Flags ({activeFlags.length})
                </h2>

                {activeFlags.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <p className="text-gray-500">No flagged visitors at this time</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {activeFlags.map((flag) => (
                      <div
                        key={flag._id}
                        className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-600"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Visitor Name</p>
                            <p className="font-semibold text-gray-900">{flag.visitorName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Reason</p>
                            <p className="font-semibold text-red-600">{flag.reason}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Flagged By</p>
                            <p className="font-semibold text-gray-900">
                              {flag.flaggedBy?.name || 'Unknown'}
                            </p>
                          </div>
                        </div>

                        {flag.notes && (
                          <div className="mb-4 p-3 bg-red-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Notes</p>
                            <p className="text-gray-900">{flag.notes}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            Flagged on {new Date(flag.createdAt).toLocaleDateString()}
                          </p>
                          <button
                            onClick={() => handleResolveClick(flag)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                          >
                            Resolve Flag
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resolved Flags */}
              {resolvedFlags.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Check className="w-6 h-6 text-green-600" />
                    Resolved Flags ({resolvedFlags.length})
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    {resolvedFlags.map((flag) => (
                      <div
                        key={flag._id}
                        className="bg-green-50 rounded-xl shadow-sm p-6 border-l-4 border-green-600 opacity-75"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Visitor Name</p>
                            <p className="font-semibold text-gray-900">{flag.visitorName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Reason</p>
                            <p className="text-gray-900 line-through">{flag.reason}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Resolved On</p>
                            <p className="font-semibold text-green-700">
                              {new Date(flag.resolvedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Resolution Modal */}
      {showModal && selectedFlag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Resolve Flag - {selectedFlag.visitorName}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Reason: {selectedFlag.reason}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resolution Notes (Optional)
              </label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Enter any additional notes..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={resolving}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={resolving}
              >
                Cancel
              </button>
              <button
                onClick={handleResolveFlag}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={resolving}
              >
                {resolving && <Loader className="w-4 h-4 animate-spin" />}
                Resolve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
