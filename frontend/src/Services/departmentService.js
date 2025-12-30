// src/Services/departmentService.js
import api from '@/lib/api';

class DepartmentService {
  static async getAllDepartments() {
    try {
      const response = await api.get('/departments');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  static async createDepartment(departmentData) {
    try {
      const response = await api.post('/departments', departmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  static async updateDepartment(id, departmentData) {
    try {
      const response = await api.put(`/departments/${id}`, departmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  static async deleteDepartment(id) {
    try {
      const response = await api.delete(`/departments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default DepartmentService;