'use client';
import { useState, useEffect } from 'react';
import { Shield, Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe } from 'lucide-react';
import Link from 'next/link';

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="contact-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="#3b82f6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#contact-grid)" />
      </svg>
      
      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      
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

function ContactMethodSVG() {
  return (
    <div className="relative w-full h-48 flex items-center justify-center mb-8">
      <svg viewBox="0 0 200 200" className="w-40 h-40 animate-float">
        <defs>
          <linearGradient id="messageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        
        {/* Message bubble */}
        <rect x="40" y="60" width="120" height="80" rx="15" fill="url(#messageGradient)" className="animate-pulse-slow" />
        
        {/* Message lines */}
        <line x1="60" y1="85" x2="140" y2="85" stroke="white" strokeWidth="4" strokeLinecap="round" />
        <line x1="60" y1="100" x2="120" y2="100" stroke="white" strokeWidth="4" strokeLinecap="round" />
        <line x1="60" y1="115" x2="130" y2="115" stroke="white" strokeWidth="4" strokeLinecap="round" />
        
        {/* Arrow pointer */}
        <path d="M80 140 L70 160 L90 145 Z" fill="url(#messageGradient)" className="animate-bounce-slow" />
        
        {/* Floating dots */}
        <circle cx="30" cy="50" r="4" fill="#60a5fa" className="animate-ping-slow" />
        <circle cx="170" cy="70" r="3" fill="#a78bfa" className="animate-ping-slow animation-delay-1000" />
        <circle cx="180" cy="130" r="3" fill="#ec4899" className="animate-ping-slow animation-delay-2000" />
      </svg>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes ping-slow {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.5s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

function ContactCard({ icon, title, content, delay }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
    }`}>
      <div className="w-14 h-14 bg-gray-900 rounded-lg flex items-center justify-center text-white mb-4 transform hover:rotate-12 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </div>
  );
}

function InfoCard({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = { name: '', email: '', message: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
        setErrors({ name: '', email: '', message: '' });
      }, 3000);
    }
  };

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
              <Link href="/about" className="text-gray-300 hover:text-white">About</Link>
              <Link href="/contact" className="text-blue-400 font-medium">Contact</Link>
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
        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-gray-900 mb-6 animate-fade-in">Get In Touch</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {"We'd love to hear from you. Send us a message and we'll respond as soon as possible."}
            </p>
          </div>
          
          <ContactMethodSVG />
        </div>
      </div>

      {/* Contact Form & Info Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-8 border border-blue-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused('')}
                    className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-300 ${
                      errors.name 
                        ? 'border-red-500' 
                        : focused === 'name' 
                        ? 'border-blue-500 shadow-lg scale-105' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-300 ${
                      errors.email 
                        ? 'border-red-500' 
                        : focused === 'email' 
                        ? 'border-blue-500 shadow-lg scale-105' 
                        : 'border-gray-300'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: '' });
                    }}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused('')}
                    rows={6}
                    className={`w-full px-4 py-3 border-2 rounded-lg outline-none resize-none transition-all duration-300 ${
                      errors.message 
                        ? 'border-red-500' 
                        : focused === 'message' 
                        ? 'border-blue-500 shadow-lg scale-105' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Your message..."
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.message}</p>
                  )}
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-gray-800 flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </div>

              {submitted && (
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg animate-bounce-in">
                  <p className="text-green-700 font-semibold flex items-center gap-2">
                    <span className="text-2xl">✓</span>
                    Message sent successfully! {"We'll"} get back to you soon.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <ContactCard
              icon={<Mail className="w-7 h-7" />}
              title="Email"
              content="support@safepass.com"
              delay={100}
            />
            <ContactCard
              icon={<Phone className="w-7 h-7" />}
              title="Phone"
              content="+1 (555) 123-4567"
              delay={200}
            />
            <ContactCard
              icon={<MapPin className="w-7 h-7" />}
              title="Address"
              content="123 Security Street, Tech City, TC 12345"
              delay={300}
            />
          </div>
        </div>

        {/* Info Cards Section */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Contact Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              icon={<MessageCircle className="w-6 h-6 text-blue-600" />}
              title="Quick Response"
              description="We typically respond within 24 hours on business days"
            />
            <InfoCard
              icon={<Clock className="w-6 h-6 text-blue-600" />}
              title="24/7 Support"
              description="Our team is available around the clock for urgent matters"
            />
            <InfoCard
              icon={<Globe className="w-6 h-6 text-blue-600" />}
              title="Global Reach"
              description="Supporting organizations worldwide with local expertise"
            />
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

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.9); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}