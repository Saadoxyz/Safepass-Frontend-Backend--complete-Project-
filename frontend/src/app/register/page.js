'use client';
import { useState, useEffect } from 'react';
import { Shield, Upload, Calendar, Clock, Lock, Users, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VisitorService from '@/Services/visitorService';
import UserService from '@/Services/userService';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hosts, setHosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    visitType: 'pre-registered',
    fullName: '',
    cnic: '',
    contact: '',
    email: '',
    hostId: '',
    hostName: '',
    department: '',
    purpose: '',
    date: '',
    time: '',
    document: null,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Fetch available hosts on component mount
  useEffect(() => {
    const fetchHosts = async () => {
      try {
        let hostsList = await UserService.getAvailableHosts();
        
        // Handle if response is wrapped in data property
        if (hostsList && typeof hostsList === 'object' && !Array.isArray(hostsList) && hostsList.data) {
          hostsList = hostsList.data;
        }
        
        // Ensure it's an array
        if (!Array.isArray(hostsList)) {
          hostsList = [];
        }
        
        console.log('Hosts loaded:', hostsList);
        setHosts(hostsList);
      } catch (error) {
        console.warn('Could not fetch hosts:', error);
        setHosts([]);
      }
    };

    fetchHosts();
  }, []);

  const handleHostChange = (e) => {
    const selectedHostId = e.target.value;
    const selectedHost = hosts.find(h => h._id === selectedHostId);
    setFormData({
      ...formData,
      hostId: selectedHostId,
      hostName: selectedHost?.name || '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.hostId || !formData.cnic || !formData.contact || !formData.purpose || !formData.date) {
      setErrorMessage('Please fill in all required fields');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsLoading(true);
    try {
      // Prepare data for API call
      const visitorData = {
        name: formData.fullName,
        cnic: formData.cnic,
        email: formData.email,
        phone: formData.contact,
        purpose: formData.purpose,
        hostName: formData.hostName,
        department: formData.department || undefined,
        visitDate: formData.date,
        hostId: formData.hostId,
      };

      // Call the API to create visitor
      const response = await VisitorService.createVisitor(visitorData);
      
      // Store response data in localStorage
      if (response) {
        localStorage.setItem('visitorGatePass', response.gatePassNumber || '');
        localStorage.setItem('visitorQRCode', response.qrCode || '');
        localStorage.setItem('visitorId', response._id || '');
        localStorage.setItem('visitorName', formData.fullName);
        localStorage.setItem('visitorEmail', formData.email);
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/visitor/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage(error.message || 'Failed to register visitor. Please try again.');
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, document: file });
    }
  };

  return (
    <div 
      className="min-h-screen py-12 px-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1B3C53 0%, #2D5A7B 100%)',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background decoration elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div style={{ backgroundColor: '#1B3C53' }} className="p-3 rounded-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">SafePass</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Visitor Access Portal</h1>
          <p className="text-blue-100 text-lg">Secure. Efficient. Gated Community Protection</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Column */}
            <div className="hidden md:flex flex-col justify-center space-y-6">
              <div className="flex gap-3 items-start">
                <CheckCircle style={{ color: '#1B3C53' }} className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Quick Registration</h3>
                  <p className="text-sm text-gray-600">Register in minutes</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle style={{ color: '#1B3C53' }} className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Secure Gate Pass</h3>
                  <p className="text-sm text-gray-600">Digital QR code access</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle style={{ color: '#1B3C53' }} className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">24/7 Access</h3>
                  <p className="text-sm text-gray-600">Anytime visitor entry</p>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
              {/* Visit Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Visit Type</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, visitType: 'pre-registered' })}
                    className="flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all"
                    style={{
                      borderColor: formData.visitType === 'pre-registered' ? '#1B3C53' : '#E5E7EB',
                      backgroundColor: formData.visitType === 'pre-registered' ? '#1B3C53' : 'white',
                      color: formData.visitType === 'pre-registered' ? 'white' : '#374151'
                    }}
                  >
                    Pre-registered
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, visitType: 'walk-in' })}
                    className="flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all"
                    style={{
                      borderColor: formData.visitType === 'walk-in' ? '#1B3C53' : '#E5E7EB',
                      backgroundColor: formData.visitType === 'walk-in' ? '#1B3C53' : 'white',
                      color: formData.visitType === 'walk-in' ? 'white' : '#374151'
                    }}
                  >
                    Walk-in
                  </button>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ color: '#1B3C53' }}>Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-2 transition-colors"
                    style={{ focus: { borderColor: '#1B3C53' } }}
                    onFocus={(e) => e.target.style.borderColor = '#1B3C53'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                    required
                  />
                  <input
                    type="text"
                    placeholder="CNIC / National ID"
                    value={formData.cnic}
                    onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-2 transition-colors"
                    onFocus={(e) => e.target.style.borderColor = '#1B3C53'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  />
                  <input
                    type="tel"
                    placeholder="Contact Number"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-2 transition-colors"
                    onFocus={(e) => e.target.style.borderColor = '#1B3C53'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-2 transition-colors"
                    onFocus={(e) => e.target.style.borderColor = '#1B3C53'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                    required
                  />
                </div>
              </div>

              {/* Visit Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ color: '#1B3C53' }}>Visit Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={formData.hostId}
                    onChange={handleHostChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-2 transition-colors"
                    onFocus={(e) => e.target.style.borderColor = '#1B3C53'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                    required
                  >
                    <option value="">Select Host</option>
                    {hosts.map(host => (
                      <option key={host._id} value={host._id}>
                        {host.name} ({host.department || 'N/A'})
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-2 transition-colors"
                    onFocus={(e) => e.target.style.borderColor = '#1B3C53'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  >
                    <option value="">Select Department</option>
                    <option value="engineering">Engineering</option>
                    <option value="hr">Human Resources</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Purpose of Visit"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-2 transition-colors md:col-span-2"
                    onFocus={(e) => e.target.style.borderColor = '#1B3C53'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                    required
                  />
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-2 transition-colors"
                      onFocus={(e) => e.target.style.borderColor = '#1B3C53'}
                      onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                      required
                    />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-2 transition-colors"
                      onFocus={(e) => e.target.style.borderColor = '#1B3C53'}
                      onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                    />
                  </div>
                </div>
              </div>

              {/* Document Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Verification Document (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
                  style={{ borderColor: formData.document ? '#1B3C53' : 'inherit' }}>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <label className="cursor-pointer">
                    <span className="font-medium" style={{ color: '#1B3C53' }}>
                      Upload a file
                    </span>
                    <span className="text-gray-600"> or drag and drop</span>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.pdf"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG, PDF up to 10MB</p>
                  {formData.document && (
                    <p className="text-sm font-medium mt-2" style={{ color: '#1B3C53' }}>✓ {formData.document.name}</p>
                  )}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setFormData({
                    visitType: 'pre-registered',
                    fullName: '',
                    cnic: '',
                    contact: '',
                    email: '',
                    hostId: '',
                    hostName: '',
                    department: '',
                    purpose: '',
                    date: '',
                    time: '',
                    document: null,
                  })}
                  className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-6 rounded-lg font-medium text-white transition-all"
                  style={{
                    backgroundColor: isLoading ? '#9CA3AF' : '#1B3C53',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.8 : 1
                  }}
                >
                  {isLoading ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            </form>
          </div>

          {/* Success Alert */}
          {showSuccess && (
            <div className="mt-6 p-4 rounded-lg flex items-start gap-3" style={{ backgroundColor: '#F0FDF4', borderColor: '#86EFAC', borderWidth: '1px' }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: '#22C55E' }}>
                <span className="text-white text-xs">✓</span>
              </div>
              <div>
                <p className="font-medium" style={{ color: '#166534' }}>Success</p>
                <p className="text-sm" style={{ color: '#15803D' }}>Your registration has been submitted successfully. Redirecting...</p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {showError && (
            <div className="mt-6 p-4 rounded-lg flex items-start gap-3" style={{ backgroundColor: '#FEF2F2', borderColor: '#FCA5A5', borderWidth: '1px' }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: '#EF4444' }}>
                <span className="text-white text-xs">!</span>
              </div>
              <div>
                <p className="font-medium" style={{ color: '#7F1D1D' }}>Error</p>
                <p className="text-sm" style={{ color: '#991B1B' }}>{errorMessage || 'Please correct the errors in the form before submitting.'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-blue-100 mt-8">
          Already registered?{' '}
          <Link href="/login" className="font-medium text-white hover:text-blue-100 transition-colors">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}