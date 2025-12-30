import AuthService from '@/Services/authService';

export const redirectByRole = () => {
  const role = AuthService.getUserRole();
  
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'host':
      return '/host/dashboard';
    case 'security':
      return '/security/dashboard';
    default:
      return '/login';
  }
};

export const checkRoleAccess = (requiredRole) => {
  const userRole = AuthService.getUserRole();
  return userRole === requiredRole;
};