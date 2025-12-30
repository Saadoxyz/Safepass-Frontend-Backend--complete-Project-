'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DepartmentService from '@/Services/departmentService';
import { Search, Plus, Edit, Trash2, Loader, X } from 'lucide-react';

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    head: '',
    description: '',
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await DepartmentService.getAllDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      alert('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = () => {
    setEditingDept(null);
    setFormData({
      name: '',
      head: '',
      description: '',
    });
    setShowModal(true);
  };

  const handleEditDepartment = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name || '',
      head: dept.head || '',
      description: dept.description || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await DepartmentService.updateDepartment(editingDept._id, formData);
        alert('Department updated successfully!');
      } else {
        await DepartmentService.createDepartment(formData);
        alert('Department created successfully!');
      }
      setShowModal(false);
      fetchDepartments();
    } catch (error) {
      console.error('Failed to save department:', error);
      alert(error.message || 'Failed to save department');
    }
  };

  const handleDeleteDepartment = async (deptId) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    
    try {
      await DepartmentService.deleteDepartment(deptId);
      alert('Department deleted successfully!');
      fetchDepartments();
    } catch (error) {
      console.error('Failed to delete department:', error);
      alert('Failed to delete department');
    }
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.head?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
          </div>
        </header>

        <main className="p-8">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  style={{
                    '--tw-ring-color': '#690B22'
                  }}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(105, 11, 34, 0.1), 0 0 0 2px white'}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                />
              </div>
              <button 
                onClick={handleAddDepartment}
                className="ml-4 flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:opacity-90"
                style={{ backgroundColor: '#690B22' }}
              >
                <Plus className="w-5 h-5" />
                Add Department
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-medium text-gray-700">NAME</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">HEAD</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">MEMBERS</th>
                      <th className="text-right py-4 px-6 font-medium text-gray-700">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDepartments.map((dept) => (
                      <tr key={dept._id} className="border-b border-gray-100">
                        <td className="py-4 px-6">{dept.name}</td>
                        <td className="py-4 px-6 text-gray-600">{dept.head || 'Not assigned'}</td>
                        <td className="py-4 px-6 text-gray-600">{dept.membersCount || 0}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEditDepartment(dept)}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                            <button 
                              onClick={() => handleDeleteDepartment(dept._id)}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingDept ? 'Edit Department' : 'Add New Department'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Head
                </label>
                <input
                  type="text"
                  value={formData.head}
                  onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingDept ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}