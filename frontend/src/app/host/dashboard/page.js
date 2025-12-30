'use client';
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import DashboardService from '@/Services/dashboardService';
import VisitorService from '@/Services/visitorService';
import { Loader } from 'lucide-react';

export default function HostDashboard() {
  const [stats, setStats] = useState({
    pendingApprovals: 0,
    upcomingVisits: 0,
    activeAlerts: 0,
  });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get current user from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Fetch pending visitors for this host (the ones that need approval)
      const pendingVisitors = await VisitorService.getPendingVisitorsForHost();
      
      // Also fetch all visitors to calculate other stats
      const allVisitors = await VisitorService.getAllVisitorsForHost();
      
      // Calculate stats
      const pendingApprovals = pendingVisitors.length;
      
      const today = new Date().toISOString().split('T')[0];
      const upcomingVisits = allVisitors.filter(v => {
        const visitDate = new Date(v.visitDate).toISOString().split('T')[0];
        return visitDate === today && (v.status === 'approved' || v.status === 'checked-in');
      }).length;
      
      // Transform pending visitors for requests table
      const hostRequests = pendingVisitors
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(visitor => ({
          id: visitor._id,
          name: visitor.name,
          cnic: visitor.cnic ? `${visitor.cnic.slice(0, 5)}-*******-${visitor.cnic.slice(-1)}` : 'Not provided',
          time: new Date(visitor.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          status: visitor.status,
          visitDate: visitor.visitDate
        }));
      
      setStats({
        pendingApprovals,
        upcomingVisits,
        activeAlerts: allVisitors.filter(v => v.status === 'alert').length,
      });
      
      setRequests(hostRequests);
    } catch (error) {
      console.error('Failed to fetch host dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, name) => {
    try {
      await VisitorService.approveVisitor(id);
      alert(`Approved visit for ${name}`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Failed to approve visitor:', error);
      alert('Failed to approve visitor. Please try again.');
    }
  };

  const handleReject = async (id, name) => {
    try {
      await VisitorService.rejectVisitor(id);
      alert(`Rejected visit for ${name}`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Failed to reject visitor:', error);
      alert('Failed to reject visitor. Please try again.');
    }
  };

  return (
    <ProtectedRoute requiredRole="host">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="host" />
        
        <div className="flex-1">
          <header className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back!</p>
              </div>
            </div>
          </header>

          <main className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-l-yellow-500">
                <p className="text-gray-600 text-sm mb-2">Pending Approvals</p>
                {loading ? (
                  <Loader className="w-8 h-8 text-gray-400 animate-spin" />
                ) : (
                  <p className="text-3xl font-bold text-gray-900">{stats.pendingApprovals}</p>
                )}
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4" style={{ borderLeftColor: '#85409D' }}>
                <p className="text-gray-600 text-sm mb-2">Upcoming Visits Today</p>
                {loading ? (
                  <Loader className="w-8 h-8 text-gray-400 animate-spin" />
                ) : (
                  <p className="text-3xl font-bold text-gray-900">{stats.upcomingVisits}</p>
                )}
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-l-red-500">
                <p className="text-gray-600 text-sm mb-2">Active Alerts</p>
                {loading ? (
                  <Loader className="w-8 h-8 text-gray-400 animate-spin" />
                ) : (
                  <p className="text-3xl font-bold text-gray-900">{stats.activeAlerts}</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Recent visitor requests</h2>
                <button 
                  onClick={fetchDashboardData}
                  className="text-sm hover:text-opacity-80"
                  style={{ color: '#85409D' }}
                >
                  Refresh
                </button>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader className="w-8 h-8 text-gray-400 animate-spin" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-6 font-medium text-gray-700">VISITOR NAME</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">CNIC</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">TIME</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">STATUS</th>
                        <th className="text-right py-4 px-6 font-medium text-gray-700">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((request, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6">{request.name}</td>
                          <td className="py-4 px-6 text-gray-600">{request.cnic}</td>
                          <td className="py-4 px-6 text-gray-600">{request.time}</td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                request.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : request.status === 'approved'
                                  ? 'bg-green-100 text-green-700'
                                  : request.status === 'checked-in'
                                  ? 'bg-blue-100 text-blue-700'
                                  : request.status === 'checked-out'
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {request.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {request.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApprove(request.id, request.name)}
                                    className="px-4 py-2 text-white rounded-lg text-sm hover:opacity-90"
                                    style={{ backgroundColor: '#85409D' }}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(request.id, request.name)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {request.status === 'approved' && (
                                <span className="text-sm text-green-600">Approved ✓</span>
                              )}
                              {request.status === 'checked-in' && (
                                <span className="text-sm" style={{ color: '#85409D' }}>Checked-in ✓</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}