'use client';
import { Shield, Users, Lock, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 z-50 flex flex-col items-center justify-center">
      <div className="relative">
        {/* Animated rings */}
        <div className="absolute inset-0 animate-ping">
          <div className="w-32 h-32 border-4 border-white/30 rounded-full"></div>
        </div>
        <div className="absolute inset-0 animate-pulse delay-150">
          <div className="w-32 h-32 border-4 border-white/20 rounded-full"></div>
        </div>
        
        {/* Main shield icon */}
        <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center animate-bounce">
          <Shield className="w-16 h-16 text-blue-600" strokeWidth={2.5} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-8 h-8 text-blue-500 animate-pulse" />
          </div>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-white mt-12 mb-4 animate-fade-in">SafePass</h1>
      <p className="text-blue-100 text-lg mb-8 animate-fade-in delay-200">Secure Visitor Management</p>
      
      {/* Progress bar */}
      <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-white/80 mt-4 text-sm">Loading... {progress}%</p>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .delay-150 {
          animation-delay: 150ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-semibold shrink-0">
        {number}
      </div>
      <span className="font-medium text-gray-700">{title}</span>
      <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
    </div>
  );
}

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true after component mounts
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SafePass</span>
            </div>
            <div className="flex items-center gap-8">
              <Link href="/" className="text-blue-400 font-medium">
                Home
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white">
                About
              </Link>
              <Link href="/visitor/dashboard" className="text-gray-300 hover:text-white">
                Visitor Registration
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white">
                Contact
              </Link>
              <Link
                href="/login"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                SafePass – Secure Visitor & Access Management
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Streamline your visitor check-in process with our secure, reliable, and easy-to-use access control system.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors"
              >
                Register as Visitor
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl relative aspect-video bg-gradient-to-br from-blue-900 to-blue-700">
              <Image 
                src="https://t4.ftcdn.net/jpg/04/72/18/19/360_F_472181971_ZCXWPAgsA2Yp6kEUhkSQDLvLvGuLhZxW.jpg"
                alt="Secure Access Control"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Key Features</h2>
          <p className="text-gray-600 mb-12 max-w-3xl">
            Discover the core capabilities that make SafePass the ideal solution for modern access control.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Users className="w-6 h-6 text-blue-600" />}
              title="Visitor Registration"
              description="Intuitive self-service kiosk for visitors to pre-register their visit securely."
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6 text-blue-600" />}
              title="Gate Pass Management"
              description="Generate and track digital or printable gate passes with unique QR codes."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-blue-600" />}
              title="Host & Security Dashboards"
              description="Real-time dashboards for hosts to approve visits and security to monitor access."
            />
            <FeatureCard
              icon={<FileText className="w-6 h-6 text-blue-600" />}
              title="Reports & Logs"
              description="Comprehensive reporting for security audits and operational insights."
            />
          </div>
        </div>
      </section>

      {/* Simple Steps */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-gray-900">Simple Steps to Visit</h2>
              <p className="text-gray-600 mb-8">
                Follow our straightforward process to ensure a smooth and secure entry to the premises.
              </p>
            </div>
            <div className="space-y-6">
              <StepCard number="1" title="Pre-register Online" />
              <StepCard number="2" title="Get Host Approval" />
              <StepCard number="3" title="Receive Your Gate Pass" />
              <StepCard number="4" title="Check-in and Visit" />
              <StepCard number="5" title="Smooth Check-out" />
              <StepCard number="6" title="Visit Logged" />
            </div>
          </div>
        </div>
      </section>

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
              <Link href="/about" className="block text-gray-400 hover:text-white text-sm">
                About Us
              </Link>
              <Link href="/features" className="block text-gray-400 hover:text-white text-sm">
                Features
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