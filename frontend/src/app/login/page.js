'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, Eye, EyeOff, Home } from 'lucide-react';
import Link from 'next/link';
import AuthService from '@/Services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoginError('');
  
  if (!email || !password) {
    setLoginError('Please fill in all fields');
    return;
  }

  setLoading(true);
  console.log('🔐 Attempting login...', { email });

  try {
    const result = await AuthService.login({ email, password });
    console.log('✅ Login API response:', result);
    
    const user = AuthService.getCurrentUser();
    console.log('👤 User stored:', user);
    
    // Redirect based on role
    switch (user.role) {
      case 'admin':
        router.push('/admin/dashboard');
        break;
      case 'host':
        router.push('/host/dashboard');
        break;
      case 'security':
        router.push('/security/dashboard');
        break;
      default:
        router.push('/dashboard');
    }
  } catch (error) {
    console.error('❌ Login error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    
    // Show detailed error
    let errorMessage = 'Login failed';
    if (error.response) {
      errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      errorMessage = 'No response from server. Check if backend is running on http://localhost:4000';
    } else {
      errorMessage = error.message || 'Login failed';
    }
    
    setLoginError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://i.pinimg.com/originals/77/8d/45/778d4510af18a71566e0616a2ce34692.jpg)'
        }}
      ></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 animate-fade-in-up border border-white/20">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center transform hover:rotate-12 transition-transform">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">SafePass</span>
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mb-2">Welcome Back</h2>
          <p className="text-white/80 text-center mb-6">Staff Login Portal</p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Login Error */}
            {loginError && (
              <div className="mb-4 p-3 bg-red-500/30 border border-red-500/50 rounded-lg">
                <p className="text-red-200 text-sm font-medium text-center">{loginError}</p>
              </div>
            )}

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
                    if (errors.email) setErrors({ ...errors, email: '' });
                    setLoginError('');
                  }}
                  placeholder="admin@safepass.com"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all bg-white/90 text-gray-900 placeholder-gray-500 ${
                    errors.email ? 'border-red-500' : 'border-white/30 focus:border-blue-400'
                  }`}
                  disabled={loading}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1 animate-fade-in font-semibold">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                    setLoginError('');
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none transition-all bg-white/90 text-gray-900 placeholder-gray-500 ${
                    errors.password ? 'border-red-500' : 'border-white/30 focus:border-blue-400'
                  }`}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1 animate-fade-in font-semibold">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-white font-medium">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-blue-300 hover:text-blue-100 font-semibold">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-white/80">
              For visitor registration, please go to{' '}
              <Link href="/register" className="text-blue-300 hover:text-blue-100 font-bold">
                Visitor Registration
              </Link>
            </p>
            
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}