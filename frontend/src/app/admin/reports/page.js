'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import VisitorService from '@/Services/visitorService';
import ReportService from '@/Services/reportService';
import { FileText, Download, Loader } from 'lucide-react';

export default function ReportsPage() {
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
    todayVisitors: 0
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const visitorsData = await VisitorService.getAllVisitors();
      setVisitors(visitorsData);
      
      // Calculate stats
      const approved = visitorsData.filter(v => v.status === 'approved').length;
      const rejected = visitorsData.filter(v => v.status === 'rejected').length;
      const pending = visitorsData.filter(v => v.status === 'pending').length;
      
      const today = new Date().toDateString();
      const todayVisitors = visitorsData.filter(v => 
        new Date(v.visitDate).toDateString() === today
      ).length;

      setStats({
        total: visitorsData.length,
        approved,
        rejected,
        pending,
        todayVisitors
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const exportAsPDF = async () => {
    try {
      setExporting(true);
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('access_token');
      
      console.log('Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN FOUND');
      console.log('Exporting PDF from:', `${baseURL}/reports/export/pdf`);
      
      const response = await fetch(`${baseURL}/reports/export/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf'
        }
      });
      
      console.log('Response status:', response.status, response.statusText);
      console.log('Response headers:', {
        'content-type': response.headers.get('content-type'),
        'content-disposition': response.headers.get('content-disposition')
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`Export failed: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      console.log('Blob size:', blob.size, 'bytes');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `visitors-report-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('PDF exported successfully!');
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert(`Export failed: ${error.message}`);
    } finally {
      setExporting(false);
    }
  };

  const exportAsExcel = async () => {
    try {
      setExporting(true);
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('access_token');
      
      console.log('Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN FOUND');
      console.log('Exporting Excel from:', `${baseURL}/reports/export/excel`);
      const response = await fetch(`${baseURL}/reports/export/excel`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'text/csv'
        }
      });
      
      console.log('Response status:', response.status, response.statusText);
      console.log('Response headers:', {
        'content-type': response.headers.get('content-type'),
        'content-disposition': response.headers.get('content-disposition')
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`Export failed: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      console.log('Blob size:', blob.size, 'bytes');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `visitors-report-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('Excel file exported successfully!');
    } catch (error) {
      console.error('Failed to export Excel:', error);
      alert('Failed to export Excel');
    } finally {
      setExporting(false);
    }
  };

  const maxValue = Math.max(stats.approved, stats.rejected, stats.pending, 1);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Reports & Logs</h1>
          </div>
        </header>

        <main className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <Loader className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Visitor Stats</h3>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stats.todayVisitors}</p>
                  <p className="text-sm text-green-600">Today&apos;s Visitors</p>
                  <div className="mt-4 h-32 bg-gray-100 rounded-lg flex items-end justify-around p-4">
                    {[40, 60, 55, 80, 70, 65, 75].map((height, i) => (
                      <div key={i} className="w-8 bg-blue-500 rounded-t" style={{height: `${height}%`}}></div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Visitor Status Breakdown</h3>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stats.total}</p>
                  <p className="text-sm text-gray-600">Total Visitors</p>
                  <div className="mt-4 flex gap-4">
                    <div 
                      className="flex-1 bg-green-500 rounded-lg transition-all"
                      style={{ height: `${(stats.approved / maxValue) * 128}px` }}
                    ></div>
                    <div 
                      className="flex-1 bg-red-500 rounded-lg transition-all"
                      style={{ height: `${(stats.rejected / maxValue) * 128}px` }}
                    ></div>
                    <div 
                      className="flex-1 bg-yellow-500 rounded-lg transition-all"
                      style={{ height: `${(stats.pending / maxValue) * 128}px` }}
                    ></div>
                  </div>
                  <div className="flex justify-around mt-4 text-sm">
                    <div className="text-center">
                      <div className="text-gray-600">Approved</div>
                      <div className="font-semibold">{stats.approved}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-600">Rejected</div>
                      <div className="font-semibold">{stats.rejected}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-600">Pending</div>
                      <div className="font-semibold">{stats.pending}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={exportAsPDF}
                      disabled={exporting}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <FileText className="w-4 h-4" />
                      {exporting ? 'Exporting...' : 'Export as PDF'}
                    </button>
                    <button 
                      onClick={exportAsExcel}
                      disabled={exporting}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      {exporting ? 'Exporting...' : 'Export as Excel'}
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-6 font-medium text-gray-700">VISITOR NAME</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">CNIC</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">VISIT TIME</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">HOST</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitors.slice(0, 20).map((visitor) => (
                        <tr key={visitor._id} className="border-b border-gray-100">
                          <td className="py-4 px-6">{visitor.name}</td>
                          <td className="py-4 px-6 text-gray-600">{visitor.cnic}</td>
                          <td className="py-4 px-6 text-gray-600">
                            {new Date(visitor.visitDate).toLocaleString()}
                          </td>
                          <td className="py-4 px-6 text-gray-600">{visitor.hostId?.name || 'N/A'}</td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                visitor.status === 'approved'
                                  ? 'bg-green-100 text-green-700'
                                  : visitor.status === 'rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : visitor.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : visitor.status === 'checked-in'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {visitor.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}