'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Search, Calendar, Download, Loader } from 'lucide-react';
import VisitorService from '@/Services/visitorService';

export default function SchedulePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const data = await VisitorService.getAllVisitorsForHost();
      setVisitors(data);
    } catch (error) {
      console.error('Failed to fetch visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVisitorStatus = (visitor) => {
    if (visitor.status === 'checked-in') return 'Checked-in';
    if (visitor.status === 'checked-out') return 'Completed';
    if (visitor.status === 'approved') {
      const visitDate = new Date(visitor.visitDate);
      const now = new Date();
      if (visitDate > now) return 'Scheduled';
      return 'Completed';
    }
    if (visitor.status === 'rejected') return 'Cancelled';
    return visitor.status?.charAt(0).toUpperCase() + visitor.status?.slice(1);
  };

  const filteredVisitors = visitors
    .filter(visitor => {
      const matchesSearch = 
        visitor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.cnic?.includes(searchTerm);
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="host" />
      
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Visit Schedule</h1>
              <p className="text-gray-600 mt-1">All your scheduled visitor visits</p>
            </div>
          </div>
        </header>

        <main className="p-8">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-wrap gap-4">
              <div className="relative flex-1 min-w-xs max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by visitor name or CNIC..."
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
              <div className="flex gap-2">
                <button 
                  onClick={fetchVisitors}
                  className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90"
                  style={{ backgroundColor: '#85409D' }}
                >
                  <Download className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 flex justify-center">
                  <Loader className="w-8 h-8 text-gray-400 animate-spin" />
                </div>
              ) : filteredVisitors.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No scheduled visits found
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Visitor Name</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">CNIC</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Visit Date</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Purpose</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">Status</th>
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
                              getVisitorStatus(visitor) === 'Checked-in'
                                ? 'bg-green-100 text-green-700'
                                : getVisitorStatus(visitor) === 'Scheduled'
                                ? 'bg-yellow-100 text-yellow-700'
                                : getVisitorStatus(visitor) === 'Completed'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {getVisitorStatus(visitor)}
                          </span>
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