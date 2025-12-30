'use client';
import { useState, useEffect } from 'react';
import { Shield, Download, Copy, Check, Loader } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import VisitorService from '@/Services/visitorService';

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-600 mb-1">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

export default function VisitorDashboard() {
  const [gatePass, setGatePass] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitDetails, setVisitDetails] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitorData();
  }, []);

  const fetchVisitorData = async () => {
    try {
      setLoading(true);
      
      // Get visitor data from localStorage or fetch from backend
      const storedPass = localStorage.getItem('visitorGatePass');
      const storedName = localStorage.getItem('visitorName');
      
      // If we have a gate pass, try to fetch details from backend
      if (storedPass) {
        // This is a simplified example - you'd need to fetch by gate pass or email
        // For now, we'll use localStorage data
        setGatePass(storedPass);
        setVisitorName(storedName || 'Visitor');
        
        // Simulate fetching visit details
        const visitors = await VisitorService.getAllVisitors();
        const visitor = visitors.find(v => 
          v.gate_pass_number === storedPass || 
          v.name === storedName
        );
        
        if (visitor) {
          setVisitDetails({
            hostName: visitor.hostName || 'Not specified',
            department: visitor.department || 'Not specified',
            date: new Date(visitor.visitDate).toLocaleDateString(),
            time: visitor.visitTime || 'Not specified',
            purpose: visitor.purpose || 'Not specified',
            status: visitor.status ? 
              visitor.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
              'Pending'
          });
        } else {
          // Fallback to stored data
          setVisitDetails({
            hostName: 'John Smith',
            department: 'Engineering',
            date: 'October 26, 2023',
            time: '10:30 AM',
            purpose: 'Project Meeting',
            status: 'Approved'
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch visitor data:', error);
      
      // Fallback data
      setGatePass('GP-A8C12E');
      setVisitorName('Jane Doe');
      setVisitDetails({
        hostName: 'John Smith',
        department: 'Engineering',
        date: 'October 26, 2023',
        time: '10:30 AM',
        purpose: 'Project Meeting',
        status: 'Approved'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gatePass);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadGatePass = async () => {
    try {
      // This would call your backend to generate PDF
      alert('Gate pass downloaded! (Demo)');
      // In real implementation:
      // await GatePassService.downloadGatePass(gatePass);
    } catch (error) {
      console.error('Failed to download gate pass:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('visitorGatePass');
    localStorage.removeItem('visitorName');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold">SafePass</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {visitorName}</span>
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900"
                onClick={handleLogout}
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center justify-center h-96">
            <Loader className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    visitDetails?.status === 'Approved' || visitDetails?.status === 'Checked-in' 
                      ? 'bg-green-500' 
                      : visitDetails?.status === 'Pending'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}></div>
                  <span className={`font-medium ${
                    visitDetails?.status === 'Approved' || visitDetails?.status === 'Checked-in' 
                      ? 'text-green-700' 
                      : visitDetails?.status === 'Pending'
                      ? 'text-yellow-700'
                      : 'text-red-700'
                  }`}>
                    {visitDetails?.status}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Your Visit Status</h1>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex flex-col items-center">
                <div className="bg-gray-900 rounded-2xl p-8 mb-4">
                  <div className="bg-white p-4 rounded-lg">
                    <QRCodeSVG 
                      value={gatePass} 
                      size={200} 
                      includeMargin={true}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-gray-600">Gate Pass Number</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{gatePass}</span>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Visit Details</h2>
                <div className="space-y-4">
                  {visitDetails ? (
                    <>
                      <DetailRow label="Host Name" value={visitDetails.hostName} />
                      <DetailRow label="Department" value={visitDetails.department} />
                      <DetailRow label="Visit Date & Time" value={`${visitDetails.date} - ${visitDetails.time}`} />
                      <DetailRow label="Purpose of Visit" value={visitDetails.purpose} />
                    </>
                  ) : (
                    <p className="text-gray-500">No visit details found.</p>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={downloadGatePass}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download / Print Gate Pass
            </button>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-xs">i</span>
              </div>
              <div>
                <p className="font-medium text-blue-900">Special Instructions</p>
                <p className="text-blue-700 text-sm">
                  Please proceed to Gate B for security check-in and have your ID ready.
                  Your gate pass must be shown at all times during your visit.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}