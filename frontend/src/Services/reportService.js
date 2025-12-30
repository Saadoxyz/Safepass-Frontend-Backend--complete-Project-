import api from '@/lib/api';

class ReportService {
  // Create suspicious report
  static async createReport(data) {
    try {
      const response = await api.post('/reports', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get all reports
  static async getAllReports() {
    try {
      const response = await api.get('/reports');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Update report status
  static async updateReportStatus(id, status) {
    try {
      const response = await api.put(`/reports/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default ReportService;