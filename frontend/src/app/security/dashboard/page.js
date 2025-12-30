'use client';
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import DashboardService from '@/Services/dashboardService';
import VisitorService from '@/Services/visitorService';
import Link from 'next/link';
import { Users, AlertTriangle, Building, Loader, AlertCircle, Flag } from 'lucide-react';

export default function SecurityDashboard() {
  const [stats, setStats] = useState({
    currentCheckins: 0,
    pendingAlerts: 0,
    totalVisitors: 0,
    flaggedVisitors: 0,
    suspiciousReports: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch visitors data
      let visitors = await VisitorService.getAllVisitors();
      const flaggedVisitors = await VisitorService.getFlaggedVisitors();
      const suspiciousReports = await VisitorService.getAllSuspiciousReports();
      
      // Handle if visitors is wrapped in a data property
      if (visitors && typeof visitors === 'object' && !Array.isArray(visitors) && visitors.data) {
        visitors = visitors.data;
      }
      
      // Ensure visitors is an array
      if (!Array.isArray(visitors)) {
        visitors = [];
      }
      
      console.log('Visitors data:', visitors);
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayVisitors = visitors.filter(v => {
        const visitDate = v.visitDate || v.createdAt;
        const dateStr = new Date(visitDate).toISOString().split('T')[0];
        return dateStr === today;
      });
      
      const currentCheckins = todayVisitors.filter(v => v.status === 'checked-in').length;
      const pendingAlerts = todayVisitors.filter(v => v.status === 'alert').length;
      const activeFlags = flaggedVisitors.filter(f => f.status === 'flagged').length;
      const reportedCases = suspiciousReports.filter(r => r.status === 'reported').length;
      
      // Transform visitors for recent activity
      const activity = todayVisitors
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 5)
        .map(visitor => ({
          name: visitor.name || 'Unknown',
          cnic: visitor.cnic ? `${visitor.cnic.slice(0, 5)}-*******-${visitor.cnic.slice(-1)}` : 'Not provided',
          gatePass: visitor.gate_pass_number || visitor.gatePassNumber || 'N/A',
          time: new Date(visitor.updatedAt || visitor.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          gate: 'Gate A',
          status: visitor.status === 'checked-in' ? 'Checked-in' : 
                 visitor.status === 'checked-out' ? 'Checked-out' : 
                 visitor.status === 'alert' ? 'Alert: Mismatch' : 
                 'Pending'
        }));
      
      console.log('Recent activity:', activity);
      
      setStats({
        currentCheckins,
        pendingAlerts,
        totalVisitors: todayVisitors.length,
        flaggedVisitors: activeFlags,
        suspiciousReports: reportedCases,
      });
      
      setRecentActivity(activity);
    } catch (error) {
      console.error('Failed to fetch security dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="security">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="security" />
        
        <div className="flex-1">
          <header className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Security Dashboard</h1>
                <p className="text-gray-600 mt-1">Monitor visitor activity in real-time</p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600">Current Check-ins</h3>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e8eef5' }}>
                  <Users className="w-5 h-5" style={{ color: '#132440' }} />
                </div>
              </div>
              {loading ? (
                <Loader className="w-8 h-8 text-gray-400 animate-spin" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{stats.currentCheckins}</p>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600">Pending Alerts</h3>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              {loading ? (
                <Loader className="w-8 h-8 text-gray-400 animate-spin" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{stats.pendingAlerts}</p>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600">Total Visitors Today</h3>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Building className="w-5 h-5 text-green-600" />
                </div>
              </div>
              {loading ? (
                <Loader className="w-8 h-8 text-gray-400 animate-spin" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{stats.totalVisitors}</p>
              )}
            </div>

            <Link href="/security/flagged-visitors">
              <div className="bg-white rounded-lg p-6 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow h-full">
                <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600">Flagged Visitors</h3>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Flag className="w-5 h-5 text-red-600" />
                </div>
              </div>
              {loading ? (
                <Loader className="w-8 h-8 text-gray-400 animate-spin" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{stats.flaggedVisitors}</p>
              )}
            </div>
            </Link>

            <Link href="/security/suspicious-reports-dashboard">
              <div className="bg-white rounded-lg p-6 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600">Suspicious Reports</h3>
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                {loading ? (
                  <Loader className="w-8 h-8 text-gray-400 animate-spin" />
                ) : (
                  <p className="text-3xl font-bold text-gray-900">{stats.suspiciousReports}</p>
                )}
              </div>
            </Link>
          </div>

          <main className="bg-gray-50 p-6 rounded-lg">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <button 
                  onClick={fetchDashboardData}
                  className="text-sm hover:text-opacity-80"
                  style={{ color: '#132440' }}
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
                        <th className="text-left py-4 px-6 font-medium text-gray-700">GATE PASS ID</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">TIME</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">GATE</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((activity, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6">{activity.name}</td>
                          <td className="py-4 px-6 text-gray-600">{activity.cnic}</td>
                          <td className="py-4 px-6 text-gray-600">{activity.gatePass}</td>
                          <td className="py-4 px-6 text-gray-600">{activity.time}</td>
                          <td className="py-4 px-6 text-gray-600">{activity.gate}</td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                activity.status === 'Checked-in'
                                  ? 'bg-green-100 text-green-700'
                                  : activity.status === 'Checked-out'
                                  ? 'bg-gray-100 text-gray-700'
                                  : activity.status.includes('Alert')
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {activity.status}
                            </span>
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