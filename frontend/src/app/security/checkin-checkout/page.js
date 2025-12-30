'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import VisitorService from '@/Services/visitorService';
import { User, Loader, Search } from 'lucide-react';

export default function CheckinCheckoutPage() {
  const [email, setEmail] = useState('');
  const [gatePass, setGatePass] = useState('');
  const [visitorData, setVisitorData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkInOutRecords, setCheckInOutRecords] = useState([]);
  const [visitorStatus, setVisitorStatus] = useState(null);

  // Fetch all check-in/check-out records on mount
  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const records = await VisitorService.getAllCheckInOut();
      setCheckInOutRecords(records);
    } catch (err) {
      console.error('Failed to load records:', err);
    }
  };

  const searchVisitor = async () => {
    if (!email || !gatePass) {
      setError('Please enter both email and gate pass number');
      return;
    }

    setLoading(true);
    setError('');
    setVisitorData(null);

    try {
      // Find visitor by email and gate pass
      const allVisitors = await VisitorService.getAllVisitors();
      const visitor = allVisitors.find(
        (v) => v.email === email && v.gatePassNumber === gatePass,
      );

      if (!visitor) {
        setError('No visitor found with this email and gate pass number');
        setLoading(false);
        return;
      }

      // Check if visitor is approved
      if (visitor.status !== 'approved') {
        setError(`Visitor status is ${visitor.status}. Only approved visitors can check-in.`);
        setLoading(false);
        return;
      }

      setVisitorData({
        id: visitor._id,
        name: visitor.name,
        email: visitor.email,
        cnic: visitor.cnic,
        host: visitor.hostName || 'Unknown Host',
        department: visitor.department || 'Not Specified',
        purpose: visitor.purpose,
        status: visitor.status,
        gatePassNumber: visitor.gatePassNumber,
      });

      setVisitorStatus(null);
    } catch (err) {
      setError(err.message || 'Failed to search visitor');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!visitorData) {
      setError('Please search for a visitor first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Record check-in to MongoDB
      await VisitorService.recordCheckIn(visitorData.id, visitorData.cnic, visitorData.gatePassNumber);

      setVisitorStatus('checked-in');
      setSuccessMessage(`${visitorData.name} checked in successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      // Reload records
      loadRecords();
    } catch (err) {
      setError(err.message || 'Failed to check in visitor');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!visitorData) {
      setError('Please search for a visitor first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Record check-out to MongoDB
      await VisitorService.recordCheckOut(visitorData.id);

      setVisitorStatus('checked-out');
      setSuccessMessage(`${visitorData.name} checked out successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      // Clear form after brief delay
      setTimeout(() => {
        handleClearForm();
        loadRecords();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to check out visitor');
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setEmail('');
    setGatePass('');
    setVisitorData(null);
    setVisitorStatus(null);
    setShowSuccess(false);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="security" />
      
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Visitor Check-in / Check-out</h1>
          </div>
        </header>

        <main className="p-8">
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
              <span className="text-green-700">{successMessage}</span>
              <button onClick={() => setShowSuccess(false)} className="ml-auto text-green-700">×</button>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white">!</div>
              <span className="text-red-700">{error}</span>
              <button onClick={() => setError('')} className="ml-auto text-red-700">×</button>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Search Visitor</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  placeholder="Enter visitor email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gate Pass Number *</label>
                <input
                  type="text"
                  placeholder="Enter gate pass number"
                  value={gatePass}
                  onChange={(e) => setGatePass(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={searchVisitor}
                className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={loading || !email || !gatePass}
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                <Search className="w-4 h-4" />
                Search Visitor
              </button>
              <button
                onClick={handleClearForm}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={loading}
              >
                Clear
              </button>
            </div>

            {visitorData && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Visitor Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-semibold text-gray-900">{visitorData.name}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-gray-900">{visitorData.email}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">CNIC</p>
                    <p className="font-semibold text-gray-900">{visitorData.cnic}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Gate Pass</p>
                    <p className="font-semibold text-gray-900">{visitorData.gatePassNumber}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Purpose</p>
                    <p className="font-semibold text-gray-900">{visitorData.purpose}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Host</p>
                    <p className="font-semibold text-gray-900">{visitorData.host}</p>
                  </div>
                </div>

                {visitorStatus === 'checked-in' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-semibold">✓ Visitor successfully checked in</p>
                  </div>
                )}

                {visitorStatus === 'checked-out' && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-700 font-semibold">✓ Visitor successfully checked out</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={handleCheckIn}
                    className="flex-1 py-3 px-6 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={loading || visitorStatus === 'checked-in'}
                  >
                    {loading && <Loader className="w-4 h-4 animate-spin" />}
                    {visitorStatus === 'checked-in' ? '✓ Checked In' : 'Check-in'}
                  </button>
                  <button
                    onClick={handleCheckOut}
                    className="flex-1 py-3 px-6 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={loading || visitorStatus !== 'checked-in'}
                  >
                    {loading && <Loader className="w-4 h-4 animate-spin" />}
                    {visitorStatus === 'checked-out' ? '✓ Checked Out' : 'Check-out'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}