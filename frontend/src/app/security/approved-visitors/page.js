'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import VisitorService from '@/Services/visitorService';
import { AlertTriangle, Loader } from 'lucide-react';

export default function ApprovedVisitorsPage() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [flagReason, setFlagReason] = useState('');
  const [flagNotes, setFlagNotes] = useState('');
  const [flagLoading, setFlagLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState('');

  // Filters
  const [dateRange, setDateRange] = useState('');
  const [department, setDepartment] = useState('');
  const [host, setHost] = useState('');

  useEffect(() => {
    loadApprovedVisitors();
  }, []);

  const loadApprovedVisitors = async () => {
    try {
      setLoading(true);
      setError('');
      const allVisitors = await VisitorService.getAllVisitors();
      const approved = allVisitors.filter(v => v.status === 'approved');
      setVisitors(approved);
    } catch (err) {
      setError('Failed to load approved visitors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    // Filter logic can be added here
    console.log('Filters applied:', { dateRange, department, host });
  };

  const handleClearFilters = () => {
    setDateRange('');
    setDepartment('');
    setHost('');
    loadApprovedVisitors();
  };

  const openFlagModal = (visitor) => {
    setSelectedVisitor(visitor);
    setShowFlagModal(true);
    setFlagReason('');
    setFlagNotes('');
  };

  const handleFlagVisitor = async () => {
    if (!flagReason.trim()) {
      alert('Please provide a reason for flagging');
      return;
    }

    setFlagLoading(true);

    try {
      await VisitorService.flagVisitor(selectedVisitor._id, flagReason, flagNotes);
      
      setShowSuccess(`${selectedVisitor.name} has been flagged successfully`);
      setTimeout(() => setShowSuccess(''), 3000);

      setShowFlagModal(false);
      loadApprovedVisitors();
    } catch (err) {
      alert('Failed to flag visitor: ' + (err.message || 'Unknown error'));
    } finally {
      setFlagLoading(false);
    }
  };

  const filteredVisitors = visitors.filter(v => {
    if (department && v.department !== department) return false;
    if (host && v.hostName !== host) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="security" />
      
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Approved Visitors List</h1>
              <p className="text-gray-600 text-sm mt-1">Monitor and flag approved visitors for suspicious activity or policy violations</p>
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
              <div className="flex items-center gap-4 flex-wrap">
                <select 
                  value={dateRange} 
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Date range</option>
                  <option value="today">Today</option>
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                </select>
                <select 
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="HR">HR</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                </select>
                <select 
                  value={host} 
                  onChange={(e) => setHost(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">All Hosts</option>
                </select>
                <button 
                  onClick={handleApplyFilters}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply Filters
                </button>
                <button 
                  onClick={handleClearFilters}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear
                </button>
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
                      <th className="text-left py-4 px-6 font-medium text-gray-700">CNIC</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">GATE PASS</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">DEPARTMENT</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">VISIT DATE</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">STATUS</th>
                      <th className="text-right py-4 px-6 font-medium text-gray-700">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVisitors.length > 0 ? (
                      filteredVisitors.map((visitor) => (
                        <tr key={visitor._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6 font-medium">{visitor.name}</td>
                          <td className="py-4 px-6 text-gray-600">{visitor.cnic}</td>
                          <td className="py-4 px-6 text-gray-600">{visitor.gatePassNumber || 'N/A'}</td>
                          <td className="py-4 px-6 text-gray-600">{visitor.department || 'Not Specified'}</td>
                          <td className="py-4 px-6 text-gray-600 text-sm">
                            {new Date(visitor.visitDate).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                              Approved
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button 
                              onClick={() => openFlagModal(visitor)}
                              className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 ml-auto"
                            >
                              <AlertTriangle className="w-4 h-4" />
                              Flag
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-8 px-6 text-center text-gray-500">
                          No approved visitors found
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

      {/* Flag Modal */}
      {showFlagModal && selectedVisitor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Flag Visitor</h2>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Visitor Name</p>
              <p className="font-medium text-gray-900">{selectedVisitor.name}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Flagging *</label>
              <select 
                value={flagReason} 
                onChange={(e) => setFlagReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={flagLoading}
              >
                <option value="">Select a reason</option>
                <option value="Suspicious Behavior">Suspicious Behavior</option>
                <option value="Unauthorized Access">Unauthorized Access</option>
                <option value="Security Concern">Security Concern</option>
                <option value="Rule Violation">Rule Violation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea 
                value={flagNotes} 
                onChange={(e) => setFlagNotes(e.target.value)}
                placeholder="Enter any additional details..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows="4"
                disabled={flagLoading}
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowFlagModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={flagLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleFlagVisitor}
                className="flex-1 py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={flagLoading || !flagReason}
              >
                {flagLoading && <Loader className="w-4 h-4 animate-spin" />}
                Flag Visitor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}