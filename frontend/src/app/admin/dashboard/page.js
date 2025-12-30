'use client';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import VisitorService from '@/Services/visitorService';
import { Search, Bell, TrendingUp, TrendingDown, Loader } from 'lucide-react';

function StatCard({ title, value, color, trend, isUp, loading }) {
  const colors = {
    blue: 'border-l-blue-500',
    yellow: 'border-l-yellow-500',
    green: 'border-l-green-500',
    red: 'border-l-red-500',
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${colors[color]}`}>
      <p className="text-gray-600 text-sm mb-2">{title}</p>
      <div className="flex items-end justify-between">
        {loading ? (
          <Loader className="w-8 h-8 text-gray-400 animate-spin" />
        ) : (
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        )}
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${isUp ? 'text-green-600' : 'text-red-600'}`}>
            {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    todayVisitors: 0,
    pendingApprovals: 0,
    currentCheckins: 0,
    alerts: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [visitorTrends, setVisitorTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    
    // Setup WebSocket connection
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const userStr = localStorage.getItem('user');
    const userId = userStr ? JSON.parse(userStr)._id : null;
    const newSocket = io(baseURL, {
      query: { userId },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log(`[Socket] Connected to notifications server: ${newSocket.id}, userId: ${userId}`);
    });

    newSocket.on('disconnect', () => {
      console.log(`[Socket] Disconnected from notifications server`);
    });

    newSocket.on('error', (error) => {
      console.error(`[Socket] Error:`, error);
    });

    newSocket.on('new-visitor', (data) => {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'new-visitor',
        message: `New visitor: ${data.data.name}`,
        timestamp: new Date(data.timestamp)
      }]);
      fetchDashboardData(); // Refresh data
    });

    newSocket.on('visitor-status-change', (data) => {
      fetchDashboardData(); // Refresh data when status changes
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const visitors = await VisitorService.getAllVisitors();
      clearTimeout(timeoutId);
      
      const today = new Date().toISOString().split('T')[0];
      const todayVisitors = visitors.filter(v => {
        const visitDate = new Date(v.visitDate).toISOString().split('T')[0];
        return visitDate === today;
      }).length;
      
      const pendingApprovals = visitors.filter(v => v.status === 'pending').length;
      const currentCheckins = visitors.filter(v => v.status === 'checked-in').length;
      
      const activity = visitors
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(visitor => ({
          id: visitor._id,
          name: visitor.name,
          company: visitor.company || 'Not specified',
          time: new Date(visitor.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          status: visitor.status,
          visitDate: visitor.visitDate
        }));
      
      const trends = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
        day,
        visitors: Math.floor(Math.random() * 100) + 50
      }));
      
      setStats({
        todayVisitors,
        pendingApprovals,
        currentCheckins,
        alerts: visitors.filter(v => v.status === 'alert').length,
      });
      
      setRecentActivity(activity);
      setVisitorTrends(trends);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="admin" />
        
        <div className="flex-1">
          <header className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search visitors, users..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:border-transparent"
                    style={{
                      '--tw-ring-color': '#690B22'
                    }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(105, 11, 34, 0.1), 0 0 0 2px white'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                  />
                </div>
                <div className="relative">
                  <button 
                    onClick={handleBellClick}
                    className="relative p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Bell className="w-6 h-6 text-gray-600" />
                    {notifications.length > 0 && (
                      <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <button 
                          onClick={clearNotifications}
                          className="text-sm hover:text-opacity-80"
                          style={{ color: '#690B22' }}
                        >
                          Clear all
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            No new notifications
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div key={notif.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                              <p className="text-sm text-gray-900">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notif.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Today's Visitors"
                value={stats.todayVisitors}
                color="blue"
                trend="+12%"
                isUp={true}
                loading={loading}
              />
              <StatCard
                title="Pending Approvals"
                value={stats.pendingApprovals}
                color="yellow"
                loading={loading}
              />
              <StatCard
                title="Current Check-ins"
                value={stats.currentCheckins}
                color="green"
                loading={loading}
              />
              <StatCard
                title="Alerts"
                value={stats.alerts}
                color="red"
                loading={loading}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                  <button 
                    onClick={fetchDashboardData}
                    className="text-sm hover:text-opacity-80"
                    style={{ color: '#690B22' }}
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
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Visitor Name</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Company</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Check-in Time</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentActivity.map((activity, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">{activity.name}</td>
                            <td className="py-4 px-4 text-gray-600">{activity.company}</td>
                            <td className="py-4 px-4 text-gray-600">{activity.time}</td>
                            <td className="py-4 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm ${
                                  activity.status === 'checked-in'
                                    ? 'bg-green-100 text-green-700'
                                    : activity.status === 'checked-out'
                                    ? 'bg-gray-100 text-gray-700'
                                    : activity.status === 'approved'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : activity.status === 'pending'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {activity.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Visitor Trends</h2>
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader className="w-8 h-8 text-gray-400 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {visitorTrends.map((trend, index) => (
                      <div key={trend.day} className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600 w-12">{trend.day}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              index === 3 ? 'bg-blue-600' : 'bg-blue-400'
                            }`}
                            style={{ width: `${Math.min(trend.visitors, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12 text-right">
                          {trend.visitors}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}