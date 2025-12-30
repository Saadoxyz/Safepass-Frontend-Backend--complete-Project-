import api from '@/lib/api';

// Helper function to extract error messages
const getErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  } else if (error?.response?.data?.error) {
    return error.response.data.error;
  } else if (error?.message) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  }
  return 'An error occurred';
};

class VisitorService {
  // Create visitor registration
  static async createVisitor(visitorData) {
    try {
      const response = await api.post('/visitors', visitorData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  // Get all visitors
  static async getAllVisitors() {
    try {
      const response = await api.get('/visitors');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  // Get all visitors for logged-in host
  static async getAllVisitorsForHost() {
    try {
      const response = await api.get('/visitors/host/all');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  // Get pending visitors for logged-in host
  static async getPendingVisitorsForHost() {
    try {
      const response = await api.get('/visitors/host/pending');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  // Get visitor by ID
  static async getVisitorById(id) {
    try {
      const response = await api.get(`/visitors/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  // Approve visitor (Host/Admin)
  static async approveVisitor(id) {
    try {
      const response = await api.put(`/visitors/${id}/approve`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  // Reject visitor (Host/Admin)
  static async rejectVisitor(id) {
    try {
      const response = await api.put(`/visitors/${id}/reject`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Check-in visitor (Security)
  static async checkInVisitor(id) {
    try {
      const response = await api.put(`/visitors/${id}/check-in`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Check-out visitor (Security)
  static async checkOutVisitor(id) {
    try {
      const response = await api.put(`/visitors/${id}/check-out`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get today's stats
  static async getTodayStats() {
    try {
      const response = await api.get('/visitors/today-stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get pending visitors for host
  static async getPendingVisitors() {
    try {
      const response = await api.get('/visitors/host/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Record check-in
  static async recordCheckIn(visitorId, cnic, gatePassNumber) {
    try {
      const response = await api.post(`/visitors/${visitorId}/check-in-record`, {
        cnic,
        gatePassNumber,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Record check-out
  static async recordCheckOut(visitorId) {
    try {
      const response = await api.post(`/visitors/${visitorId}/check-out-record`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get all check-in/check-out records
  static async getAllCheckInOut(filters = {}) {
    try {
      const response = await api.get('/visitors/check-in-out/all', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Flag a visitor
  static async flagVisitor(visitorId, reason, notes = '') {
    try {
      const response = await api.post(`/visitors/${visitorId}/flag`, {
        reason,
        notes,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get flagged visitors
  static async getFlaggedVisitors() {
    try {
      const response = await api.get('/visitors/flagged/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Resolve a flagged visitor
  static async resolveFlag(flagId, notes = '') {
    try {
      const response = await api.put(`/visitors/flag/${flagId}/resolve`, { notes });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Report suspicious activity
  static async reportSuspicious(visitorId, reason, notes = '') {
    try {
      const response = await api.post(`/visitors/${visitorId}/suspicious-report`, {
        reason,
        notes,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get all suspicious reports
  static async getAllSuspiciousReports(status = '') {
    try {
      const response = await api.get('/visitors/suspicious/all', {
        params: { status },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Update suspicious report status
  static async updateSuspiciousReportStatus(reportId, status, resolutionNotes = '') {
    try {
      const response = await api.put(`/visitors/suspicious/${reportId}/status`, {
        status,
        resolutionNotes,
      });
      return response.data;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  }
}

export default VisitorService;