'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import VisitorService from '@/Services/visitorService';
import { AlertCircle, Loader, X, Check, Filter } from 'lucide-react';

export default function SuspiciousReportsPage() {
  const [profileImage, setProfileImage] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loadReports = async () => {
    try {
      setLoading(true);
      // Always load ALL reports - filter client-side for accurate counts
      const data = await VisitorService.getAllSuspiciousReports('');
      setReports(data || []);
    } catch (err) {
      setError('Failed to load suspicious reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleStatusChange = (report, newStatus) => {
    setSelectedReport(report);
    setResolutionNotes('');
    setShowModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedReport) return;

    setUpdating(true);
    try {
      const newStatus = selectedReport.status === 'reported' ? 'investigating' : 'resolved';
      const result = await VisitorService.updateSuspiciousReportStatus(
        selectedReport._id,
        newStatus,
        resolutionNotes,
      );
      
      if (!result) {
        throw new Error('No response from server');
      }
      
      setSuccessMessage(`Report status updated to "${newStatus}"`);
      setShowModal(false);
      setSelectedReport(null);
      setUpdating(false);

      // Reload reports after success
      setTimeout(() => {
        loadReports();
        setSuccessMessage('');
      }, 1500);
    } catch (err) {
      console.error('Error updating report status:', err);
      let errorMessage = 'Failed to update report';
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reported':
        return 'bg-red-50 border-red-300 text-red-700';
      case 'investigating':
        return 'bg-yellow-50 border-yellow-300 text-yellow-700';
      case 'resolved':
        return 'bg-green-50 border-green-300 text-green-700';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-700';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'reported':
        return '🔴 Reported';
      case 'investigating':
        return '🟡 Investigating';
      case 'resolved':
        return '🟢 Resolved';
      default:
        return status;
    }
  };

  const filteredReports = reports.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="security" />

      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-orange-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Suspicious Activity Reports</h1>
                <p className="text-gray-600 text-sm mt-1">Review all reported incidents, investigate cases, and track resolution status</p>
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
              <button onClick={() => setError('')} className="ml-auto text-red-700">
                ×
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="mb-6 flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <div className="flex gap-2">
              {['all', 'reported', 'investigating', 'resolved'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
                  }`}
                >
                  {status === 'all' ? 'All Reports' : getStatusBadge(status)}
                  {status === 'reported' && ` (${reports.filter((r) => r.status === 'reported').length})`}
                  {status === 'investigating' && ` (${reports.filter((r) => r.status === 'investigating').length})`}
                  {status === 'resolved' && ` (${reports.filter((r) => r.status === 'resolved').length})`}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {filteredReports.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    {statusFilter === 'all'
                      ? 'No suspicious reports yet'
                      : `No ${statusFilter} reports`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredReports.map((report) => (
                    <div
                      key={report._id}
                      className={`rounded-xl shadow-sm p-6 border-l-4 ${getStatusColor(report.status)}`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Visitor</p>
                          <p className="font-semibold text-gray-900">
                            {report.visitorName || 'Unknown'}
                          </p>
                          {report.visitorId?._id && (
                            <p className="text-xs text-gray-500 mt-1">
                              ID: {report.visitorId._id.substring(0, 8)}...
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Reason</p>
                          <p className="font-semibold text-orange-600">{report.reason}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Status</p>
                          <p className="font-semibold">{getStatusBadge(report.status)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Reported By</p>
                          <p className="font-semibold text-gray-900">
                            {report.reportedByName || 'Unknown'}
                          </p>
                        </div>
                      </div>

                      {report.notes && (
                        <div className="mb-4 p-3 bg-white bg-opacity-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Report Notes</p>
                          <p className="text-gray-900">{report.notes}</p>
                        </div>
                      )}

                      {report.resolutionNotes && report.status === 'resolved' && (
                        <div className="mb-4 p-3 bg-green-100 bg-opacity-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Resolution Notes</p>
                          <p className="text-gray-900">{report.resolutionNotes}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {report.status === 'resolved' && report.resolvedAt
                            ? `Resolved on ${new Date(report.resolvedAt).toLocaleDateString()}`
                            : `Reported on ${new Date(report.createdAt).toLocaleDateString()}`}
                        </p>
                        {report.status !== 'resolved' && (
                          <button
                            onClick={() => handleStatusChange(report, '')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${
                              report.status === 'reported'
                                ? 'bg-yellow-600 hover:bg-yellow-700'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {report.status === 'reported' ? 'Start Investigating' : 'Mark as Resolved'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Update Status Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Update Report Status
            </h3>
            <p className="text-sm text-gray-600 mb-2">Visitor: {selectedReport.visitorName}</p>
            <p className="text-sm text-gray-600 mb-6">Reason: {selectedReport.reason}</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resolution/Investigation Notes
              </label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Enter notes about this investigation..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={updating}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={updating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={updating}
              >
                {updating && <Loader className="w-4 h-4 animate-spin" />}
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
