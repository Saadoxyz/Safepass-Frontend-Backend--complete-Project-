import api from '@/lib/api';

class UploadService {
  // Upload profile image
  static async uploadProfileImage(formData) {
    try {
      console.log('UploadService: Posting to /upload/profile-image');
      const response = await api.post('/upload/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('UploadService response:', response.data);
      if (!response.data?.imageUrl) {
        console.error('UploadService: No imageUrl in response!', response.data);
        throw new Error('No imageUrl in upload response');
      }
      
      return response.data;
    } catch (error) {
      console.error('UploadService error:', error.response?.data || error.message || error);
      throw error.response?.data || error;
    }
  }

  // Get stored profile image
  static getStoredProfileImage() {
    return localStorage.getItem('profileImage');
  }

  // Clear stored profile image
  static clearStoredProfileImage() {
    localStorage.removeItem('profileImage');
  }
}

export default UploadService;