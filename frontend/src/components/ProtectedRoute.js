'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/Services/authService';

export default function ProtectedRoute({ children, requiredRole }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Check if user is authenticated
      if (!AuthService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      // Check role if required
      if (requiredRole) {
        const userRole = AuthService.getUserRole();
        if (userRole !== requiredRole) {
          // Redirect based on user's actual role
          switch (userRole) {
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
              router.push('/login');
          }
          return;
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, [router, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Loading...</p>
          <p className="mt-2 text-sm text-gray-500">Checking authentication</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}