'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Download, ArrowLeft, Loader, QrCode, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import GatePassService from '@/Services/gatePassService';

const QRCodeCanvas = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeCanvas), {
  ssr: false,
});

export default function GatePassPage() {
  const params = useParams();
  const gatePassNumber = params.number;
  const [gatePass, setGatePass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const fetchGatePass = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await GatePassService.getGatePassByNumber(gatePassNumber);
      setGatePass(data);
    } catch (err) {
      console.error('Error fetching gate pass:', err);
      setError('Failed to load gate pass. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [gatePassNumber]);

  useEffect(() => {
    fetchGatePass();
  }, [fetchGatePass]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await GatePassService.downloadGatePass(gatePassNumber);
    } catch (err) {
      console.error('Error downloading gate pass:', err);
      setError('Failed to download gate pass. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading gate pass...</p>
        </div>
      </div>
    );
  }

  if (error || !gatePass) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gate Pass Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'The gate pass you are looking for does not exist or has expired.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isExpired = new Date(gatePass.validUntil) < new Date();
  const isApproved = gatePass.status === 'approved' || gatePass.status === 'checked-in';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Gate Pass Approved</h1>
                <p className="text-blue-100">Your visit has been approved</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-300" />
            </div>
          </div>

          {/* Status Alert */}
          {isExpired && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700 font-semibold">⚠️ This gate pass has expired</p>
            </div>
          )}

          {/* Content Section */}
          <div className="p-8">
            {/* Visitor Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Visitor Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Visitor Name</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {gatePass.visitorId?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">CNIC</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {gatePass.visitorId?.cnic
                      ? `${gatePass.visitorId.cnic.slice(0, 5)}-*******-${gatePass.visitorId.cnic.slice(-1)}`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Gate Pass Details */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Gate Pass Details</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-600">Gate Pass Number:</span>
                  <span className="font-mono font-bold text-gray-900 break-all">{gatePassNumber}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-600">Valid Until:</span>
                  <span className={`font-semibold ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                    {new Date(gatePass.validUntil).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    isExpired
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {isExpired ? 'Expired' : 'Valid'}
                  </span>
                </div>
                {gatePass.visitorId?.purpose && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Purpose:</span>
                    <span className="text-gray-900 font-medium">{gatePass.visitorId.purpose}</span>
                  </div>
                )}
              </div>
            </div>

            {/* QR Code Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                QR Code
              </h2>
              <div className="bg-gray-50 rounded-lg p-8 flex justify-center">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                  <QRCodeCanvas
                    value={gatePassNumber}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center mt-3">
                Show this QR code at the gate for verification
              </p>
            </div>

            {/* Download Section */}
            <div className="mb-8">
              <button
                onClick={handleDownload}
                disabled={downloading || isExpired}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold text-lg transition-all ${
                  downloading || isExpired
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                }`}
              >
                {downloading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Gate Pass (PDF)
                  </>
                )}
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">Instructions</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
                  <span>Save or download your gate pass</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
                  <span>Show the QR code or gate pass number at the security gate</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">3</span>
                  <span>Check in/out as required by the facility</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">4</span>
                  <span>Gate pass is valid until the specified date and time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Questions? Contact the facility management or your host
          </p>
        </div>
      </div>
    </div>
  );
}
