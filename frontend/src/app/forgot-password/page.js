'use client';
import { useState } from 'react';
import { Shield, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import AuthService from '@/Services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setSending(true);
    setError('');
    
    try {
      // Call backend API
      await AuthService.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://png.pngtree.com/thumb_back/fw800/background/20220509/pngtree-cyber-security-computer-data-encryption-image_1341457.jpg)'
        }}
      ></div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-20 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-pink-400 rounded-full animate-ping animation-delay-2000"></div>
        <div className="absolute top-1/2 right-20 w-2 h-2 bg-indigo-400 rounded-full animate-ping animation-delay-3000"></div>
      </div>

      {/* Floating Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-4000"></div>
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 animate-fade-in-up border border-white/20">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center transform hover:rotate-12 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SafePass</span>
          </div>

          {!submitted ? (
            <>
              <h2 className="text-3xl font-bold text-white text-center mb-2">
                Forgot Password?
              </h2>
              <p className="text-white text-center mb-8">
                {"No worries, we'll send you reset instructions"}
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-200 text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter your email"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all bg-white/90 text-gray-900 placeholder-gray-500 ${
                        error ? 'border-red-500' : 'border-white/30 focus:border-blue-400'
                      }`}
                      disabled={sending}
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                      Sending...
                    </>
                  ) : 'Reset Password'}
                </button>

                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-white hover:text-blue-200 font-semibold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to log in
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center animate-scale-in">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Check your email</h3>
              <p className="text-white mb-2 font-medium">
                We sent a password reset link to
              </p>
              <p className="text-blue-300 font-bold mb-6 break-all text-lg">{email}</p>
              
              <div className="space-y-4 mb-8">
                <p className="text-sm text-white font-medium">
                  {"Didn't receive the email? Check your spam folder"}
                </p>
                <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-4">
                  <p className="text-white text-sm">
                    <span className="font-semibold block mb-2">💡 Need immediate help?</span>
                    If you don't receive the reset link or have any issues, please contact your administrator for password reset assistance.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-blue-300 hover:text-blue-100 font-bold text-sm"
                >
                  Try another email
                </button>
              </div>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-white hover:text-blue-200 font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to log in
              </Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}