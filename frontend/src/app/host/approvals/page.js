'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Search, Calendar, Loader } from 'lucide-react';
import VisitorService from '@/Services/visitorService';

export default function ApprovalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApprovals: 0,
    pendingApprovals: 0,
    approvedCount: 0,
    rejectedCount: 0,
  });

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const data = await VisitorService.getAllVisitorsForHost();
      setVisitors(data);

      // Calculate stats
      const stats = {
        totalApprovals: data.length,
        pendingApprovals: data.filter(v => v.status === 'pending').length,
        approvedCount: data.filter(v => v.status === 'approved').length,
        rejectedCount: data.filter(v => v.status === 'rejected').length,
      };
      setStats(stats);
    } catch (error) {
      console.error('Failed to fetch visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, name) => {
    try {
      await VisitorService.approveVisitor(id);
      alert(`Approved visit for ${name}`);
      fetchVisitors();
    } catch (error) {
      console.error('Failed to approve visitor:', error);
      alert('Failed to approve visitor. Please try again.');
    }
  };

  const handleReject = async (id, name) => {
    try {
      await VisitorService.rejectVisitor(id);
      alert(`Rejected visit for ${name}`);
      fetchVisitors();
    } catch (error) {
      console.error('Failed to reject visitor:', error);
      alert('Failed to reject visitor. Please try again.');
    }
  };

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = 
      visitor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.cnic?.includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === 'All' || 
      visitor.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="host" />
      
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Visitor Approval Requests</h1>
              <p className="text-gray-600 mt-1">Manage and approve visitor requests</p>
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4" style={{ borderLeftColor: '#85409D' }}>
              <p className="text-gray-600 text-sm mb-2">Total Requests</p>
              {loading ? (
                <Loader className="w-8 h-8 text-gray-400 animate-spin" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{stats.totalApprovals}</p>
              )}
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-l-yellow-500">
              <p className="text-gray-600 text-sm mb-2">Pending</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingApprovals}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-l-green-500">
              <p className="text-gray-600 text-sm mb-2">Approved</p>
              <p className="text-3xl font-bold text-gray-900">{stats.approvedCount}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-l-red-500">
              <p className="text-gray-600 text-sm mb-2">Rejected</p>
              <p className="text-3xl font-bold text-gray-900">{stats.rejectedCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-wrap gap-4">
              <div className="relative flex-1 min-w-xs max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or CNIC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  style={{
                    '--tw-ring-color': '#85409D'
                  }}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(133, 64, 157, 0.1), 0 0 0 2px white'}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option>All</option>
                <option>pending</option>
                <option>approved</option>
                <option>rejected</option>
              </select>
              <button 
                onClick={fetchVisitors}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90"
                style={{ backgroundColor: '#85409D' }}
              >
                Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 flex justify-center">
                  <Loader className="w-8 h-8 text-gray-400 animate-spin" />
                </div>
              ) : filteredVisitors.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No visitors found
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Visitor Name</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">CNIC</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Visit Date/Time</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Purpose</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Status</th>
                      <th className="text-right py-4 px-6 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVisitors.map((visitor) => (
                      <tr key={visitor._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6">{visitor.name}</td>
                        <td className="py-4 px-6 text-gray-600">
                          {visitor.cnic ? `${visitor.cnic.slice(0, 5)}-*******-${visitor.cnic.slice(-1)}` : 'Not provided'}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {new Date(visitor.visitDate).toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-gray-600">{visitor.purpose || 'Not specified'}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              visitor.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : visitor.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : visitor.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {visitor.status?.charAt(0).toUpperCase() + visitor.status?.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {visitor.status === 'pending' && (
                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => handleApprove(visitor._id, visitor.name)}
                                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleReject(visitor._id, visitor.name)}
                                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {visitor.status !== 'pending' && (
                            <span className="text-gray-500 text-sm">{visitor.status}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}