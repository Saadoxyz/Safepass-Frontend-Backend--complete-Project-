import api from '@/lib/api';

class AuthService {
  // Login user
  static async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Login failed';
    }
  }

  // Forgot password
  static async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Request failed';
    }
  }

  // Reset password
  static async resetPassword(token, password) {
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Reset failed';
    }
  }

  // Get current user
  static getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Logout
  static logout() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  // Check if authenticated
  static isAuthenticated() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
  }

  // Get user role
  static getUserRole() {
    const user = this.getCurrentUser();
    return user?.role;
  }

  // Get auth headers
  static getAuthHeader() {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export default AuthService;