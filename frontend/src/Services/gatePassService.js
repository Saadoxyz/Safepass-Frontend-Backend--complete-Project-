import api from '@/lib/api';

class GatePassService {
  // Get gate pass by number
  static async getGatePassByNumber(gatePassNumber) {
    try {
      const response = await api.get(`/gate-passes/number/${gatePassNumber}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Download gate pass PDF
  static async downloadGatePass(gatePassNumber) {
    try {
      const response = await api.get(`/gate-passes/${gatePassNumber}/download`, {
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `gate-pass-${gatePassNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Revoke gate pass
  static async revokeGatePass(id) {
    try {
      const response = await api.put(`/gate-passes/${id}/revoke`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default GatePassService;