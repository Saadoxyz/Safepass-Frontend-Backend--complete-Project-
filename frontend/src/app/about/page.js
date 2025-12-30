'use client';
import { Shield, Users, Lock, Award, Zap, Globe, TrendingUp, Heart } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

function ValueCard({ icon, title, description, delay }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg p-8 text-center transform transition-all duration-700 hover:scale-105 hover:shadow-2xl ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white transform hover:rotate-12 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-semibold text-xl mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function StatCard({ number, label, delay }) {
  const [count, setCount] = useState(0);
  const target = parseInt(number);

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = target / 50;
      const interval = setInterval(() => {
        setCount(prev => {
          const next = prev + increment;
          if (next >= target) {
            clearInterval(interval);
            return target;
          }
          return next;
        });
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, delay]);

  return (
    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
      <div className="text-4xl font-bold text-blue-600 mb-2">
        {Math.floor(count)}{number.includes('+') ? '+' : ''}
      </div>
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  );
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="#3b82f6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      
      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
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
      `}</style>
    </div>
  );
}

function SecurityShieldSVG() {
  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-48 h-48 animate-float">
        <defs>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>
        </defs>
        
        {/* Shield outline */}
        <path
          d="M100 20 L160 50 L160 100 Q160 140 100 180 Q40 140 40 100 L40 50 Z"
          fill="url(#shieldGradient)"
          className="animate-pulse-slow"
        />
        
        {/* Inner shield */}
        <path
          d="M100 40 L145 60 L145 100 Q145 130 100 160 Q55 130 55 100 L55 60 Z"
          fill="#60a5fa"
          opacity="0.5"
        />
        
        {/* Checkmark */}
        <path
          d="M80 100 L95 115 L120 85"
          stroke="white"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-draw"
        />
      </svg>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes draw {
          0% { stroke-dasharray: 100; stroke-dashoffset: 100; }
          100% { stroke-dasharray: 100; stroke-dashoffset: 0; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        .animate-draw {
          animation: draw 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-gray-900 sticky top-0 z-50 backdrop-blur-sm bg-gray-900/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SafePass</span>
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
              <Link href="/about" className="text-blue-400 font-medium">About</Link>
              <Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link>
              <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Animated Background */}
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <AnimatedBackground />
        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-gray-900 mb-6 animate-fade-in">About SafePass</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Leading the way in secure visitor management and access control solutions for modern organizations.
            </p>
          </div>
          
          <SecurityShieldSVG />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard number="500+" label="Organizations" delay={0} />
            <StatCard number="10000+" label="Daily Visitors" delay={200} />
            <StatCard number="99" label="Uptime %" delay={400} />
            <StatCard number="24" label="Support Hours" delay={600} />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 text-lg">What makes SafePass different</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValueCard 
              icon={<Shield className="w-8 h-8" />} 
              title="Security First" 
              description="Your data protection is our top priority"
              delay={100}
            />
            <ValueCard 
              icon={<Users className="w-8 h-8" />} 
              title="User Friendly" 
              description="Intuitive design for everyone"
              delay={200}
            />
            <ValueCard 
              icon={<Zap className="w-8 h-8" />} 
              title="Lightning Fast" 
              description="Quick check-ins and processing"
              delay={300}
            />
            <ValueCard 
              icon={<Globe className="w-8 h-8" />} 
              title="Global Scale" 
              description="Trusted worldwide by organizations"
              delay={400}
            />
          </div>
        </div>
      </div>

      {/* Mission Section with 3D Card Effect */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-12 text-white transform hover:scale-105 transition-transform duration-300">
                <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg leading-relaxed mb-6 text-blue-50">
                  At SafePass, we believe that visitor management should be seamless, secure, and smart. 
                  Our platform combines cutting-edge technology with intuitive design to create an access 
                  control system that works for everyone.
                </p>
                <p className="text-lg leading-relaxed text-blue-50">
                  Founded in 2023, we have quickly become the trusted choice for organizations worldwide 
                  seeking to modernize their visitor management processes while maintaining the highest 
                  security standards.
                </p>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 space-y-6">
              <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Innovation Driven</h3>
                  <p className="text-gray-600">Constantly evolving to meet modern security needs</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Customer Focused</h3>
                  <p className="text-gray-600">Your success is our success</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Award Winning</h3>
                  <p className="text-gray-600">Recognized for excellence in security technology</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SafePass</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Secure and streamlined visitor access management for modern organizations.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
            <div className="space-y-3">
              <Link href="/" className="block text-gray-400 hover:text-white text-sm">
                Home
              </Link>
              <Link href="/about" className="block text-gray-400 hover:text-white text-sm">
                About Us
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white text-sm">
                Contact
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Legal</h3>
            <div className="space-y-3">
              <Link href="#" className="block text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="block text-gray-400 hover:text-white text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          © 2024 SafePass Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}