'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import SettingsService from '@/Services/settingsService';
import { Clock, Plus, Loader } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [visitingHours, setVisitingHours] = useState({
    startTime: '09:00',
    endTime: '17:00',
    selectedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  });

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    fetchVisitingHours();
  }, []);

  const fetchVisitingHours = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await SettingsService.getVisitingHours();
      setVisitingHours({
        startTime: data.startTime,
        endTime: data.endTime,
        selectedDays: data.days,
      });
    } catch (error) {
      console.error('Failed to fetch visiting hours:', error);
      setError('Failed to load visiting hours. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveVisitingHours = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      await SettingsService.updateVisitingHours({
        startTime: visitingHours.startTime,
        endTime: visitingHours.endTime,
        days: visitingHours.selectedDays,
      });
      setSuccess('Visiting hours saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to save visiting hours:', error);
      setError('Failed to save visiting hours. Please check your input and try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (day) => {
    setVisitingHours(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day]
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar role="admin" />
        <div className="flex-1 flex items-center justify-center">
          <Loader className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar role="admin" />
      
      <div className="flex-1 bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        </header>

        <main className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white">!</div>
              <span className="text-red-700 flex-1">{error}</span>
              <button onClick={() => setError('')} className="text-red-700 font-bold">×</button>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
              <span className="text-green-700 flex-1">{success}</span>
              <button onClick={() => setSuccess('')} className="text-green-700 font-bold">×</button>
            </div>
          )}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200 px-6">
              <h2 className="py-4 text-lg font-semibold text-gray-900">Visiting Hours</h2>
            </div>

            <div className="p-8">
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Set Visiting Hours</h2>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="time"
                        value={visitingHours.startTime}
                        onChange={(e) => setVisitingHours({...visitingHours, startTime: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="time"
                        value={visitingHours.endTime}
                        onChange={(e) => setVisitingHours({...visitingHours, endTime: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Apply to Days</label>
                  <div className="flex gap-2">
                    {days.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${
                          visitingHours.selectedDays.includes(day)
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Special Hours</h3>
                  <p className="text-gray-600 text-sm mb-4">No special hours defined. Add specific dates for holidays or events.</p>
                  <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium">
                    <Plus className="w-4 h-4" />
                    Add Special Hours
                  </button>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                  <button 
                    onClick={() => {
                      setError('');
                      setSuccess('');
                      fetchVisitingHours();
                    }}
                    className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveVisitingHours}
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}