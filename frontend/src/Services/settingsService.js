// src/Services/settingsService.js
import api from '@/lib/api';

class SettingsService {
  static async getVisitingHours() {
    try {
      const response = await api.get('/settings/visiting-hours');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  static async updateVisitingHours(data) {
    try {
      const response = await api.put('/settings/visiting-hours', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default SettingsService;