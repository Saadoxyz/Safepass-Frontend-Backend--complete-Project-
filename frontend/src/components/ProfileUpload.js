'use client';
import { useState, useEffect, useCallback } from 'react';
import { Camera, User } from 'lucide-react';
import Image from 'next/image';
import { useProfile } from '@/contexts/ProfileContext';
import UploadService from '@/Services/uploadService';

export default function ProfileUpload() {
  const { profileImage, setProfileImage } = useProfile();
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Initialize preview from context image
  useEffect(() => {
    if (profileImage) {
      console.log('ProfileUpload: Setting preview from context:', profileImage);
      setPreview(profileImage);
    }
  }, [profileImage]);

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    try {
      setUploading(true);
      console.log('Starting file upload...');
      console.log('File info:', { name: file.name, size: file.size, type: file.type });
      
      // Show preview immediately from file
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Local preview created from FileReader');
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload the file
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('Uploading file to server...');
      const response = await UploadService.uploadProfileImage(formData);
      console.log('Upload response received:', response);
      
      if (!response) {
        throw new Error('No response from upload service');
      }
      
      if (!response.imageUrl) {
        console.error('Response object:', response);
        throw new Error('No imageUrl in response: ' + JSON.stringify(response));
      }
      
      // Update context with the new image URL
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const imageUrl = `${baseURL}${response.imageUrl}`;
      console.log('Updating profile context with:', imageUrl);
      setProfileImage(imageUrl);
      
      // Verify localStorage was set
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          const stored = localStorage.getItem('profileImage');
          console.log('Post-upload localStorage check:', stored === imageUrl ? 'SUCCESS' : 'FAILED');
          if (stored !== imageUrl) {
            console.error('WARNING: localStorage mismatch after upload!');
            console.error('Expected:', imageUrl.substring(0, 50) + '...');
            console.error('Got:', stored ? stored.substring(0, 50) + '...' : 'NULL');
          }
        }, 100);
      }
      
      console.log('✅ Photo uploaded successfully and persisted to localStorage.');
    } catch (error) {
      console.error('Failed to upload image:', error.message || error);
      alert('Failed to upload image: ' + (error.message || String(error)));
      // Reset preview on error
      console.log('Resetting preview to:', profileImage);
      setPreview(profileImage || null);
    } finally {
      setUploading(false);
    }
  }, [profileImage, setProfileImage]);

  return (
    <div className="relative inline-block">
      <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden relative">
        {preview ? (
          <Image
            src={preview}
            alt="Profile"
            width={96}
            height={96}
            className="w-full h-full object-cover"
            priority
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>
      <label className={`absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 shadow-lg ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <Camera className="w-4 h-4 text-white" />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
}