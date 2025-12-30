// src/Services/userService.js
import api from '@/lib/api';

class UserService {
  static async getProfile() {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      // Silently handle 401 (not logged in) or network errors
      if (error.response?.status === 401) {
        console.warn('UserService: Not authenticated');
        return null;
      }
      if (!error.response) {
        console.warn('UserService: Network error - API may not be running');
        return null;
      }
      throw error.response?.data || error;
    }
  }

  static async updateProfile(data) {
    try {
      const response = await api.put('/users/profile/update', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  static async getAllUsers() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  static async getAvailableHosts() {
    try {
      const response = await api.get('/users/public/hosts');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch available hosts:', error);
      return [];
    }
  }

  static async createUser(userData) {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  static async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  static async deleteUser(userId) {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default UserService;