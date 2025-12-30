'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import VisitorService from '@/Services/visitorService';
import { Search, Loader } from 'lucide-react';

export default function SuspiciousReportPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState('');
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadVisitors();
  }, []);

  const loadVisitors = async () => {
    try {
      setLoading(true);
      const allVisitors = await VisitorService.getAllVisitors();
      // Show visitors that are checked-in or on-site
      const currentVisitors = allVisitors.filter(v => 
        v.status === 'checked-in' || v.status === 'approved'
      );
      setVisitors(currentVisitors);
    } catch (err) {
      setError('Failed to load visitors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async () => {
    if (!reason.trim()) {
      alert('Please select a reason');
      return;
    }

    setSubmitLoading(true);

    try {
      await VisitorService.reportSuspicious(selectedVisitor._id, reason, notes);
      
      setShowSuccess(`${selectedVisitor.name} has been reported as suspicious`);
      setTimeout(() => setShowSuccess(''), 3000);

      setShowModal(false);
      setReason('');
      setNotes('');
      loadVisitors();
    } catch (err) {
      alert('Failed to submit report: ' + (err.message || 'Unknown error'));
    } finally {
      setSubmitLoading(false);
    }
  };

  const openReportModal = (visitor) => {
    setSelectedVisitor(visitor);
    setShowModal(true);
    setReason('');
    setNotes('');
  };

  const filteredVisitors = visitors.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="security" />
      
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Report Suspicious Visitor</h1>
              <p className="text-gray-600 text-sm mt-1">File a report for a visitor currently on-site who is showing suspicious behavior or posing a security concern</p>
            </div>
          </div>
        </header>

        <main className="p-8">
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
              <span className="text-green-700">{showSuccess}</span>
              <button onClick={() => setShowSuccess('')} className="ml-auto text-green-700">×</button>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search visitors by name, company, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <Loader className="w-8 h-8 animate-spin mx-auto text-gray-400" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-medium text-gray-700">VISITOR NAME</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">COMPANY</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">EMAIL</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">STATUS</th>
                      <th className="text-right py-4 px-6 font-medium text-gray-700">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVisitors.length > 0 ? (
                      filteredVisitors.map((visitor) => (
                        <tr key={visitor._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6">{visitor.name}</td>
                          <td className="py-4 px-6 text-gray-600">{visitor.company || 'N/A'}</td>
                          <td className="py-4 px-6 text-gray-600 text-sm">{visitor.email}</td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                visitor.status === 'checked-in'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {visitor.status === 'checked-in' ? 'On-Site' : 'Approved'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => openReportModal(visitor)}
                              className="text-red-600 hover:text-red-700 font-medium"
                            >
                              Report Suspicious
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-8 px-6 text-center text-gray-500">
                          No visitors found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {showModal && selectedVisitor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Visitor</h2>
            <p className="text-gray-600 mb-6">Reporting: <strong>{selectedVisitor.name}</strong></p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Report *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={submitLoading}
                >
                  <option value="">Select a reason</option>
                  <option value="Unauthorized Area Access">Unauthorized Area Access</option>
                  <option value="Suspicious Behavior">Suspicious Behavior</option>
                  <option value="Policy Violation">Policy Violation</option>
                  <option value="Security Threat">Security Threat</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide specific details about the incident..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={submitLoading}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">Report Time</p>
                  <p>{new Date().toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Department</p>
                  <p>{selectedVisitor.department || 'Not Specified'}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={submitLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="flex-1 py-3 px-6 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={submitLoading || !reason}
              >
                {submitLoading && <Loader className="w-4 h-4 animate-spin" />}
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}