// src/contexts/ProfileContext.js
'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import UserService from '@/Services/userService';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  // Initialize synchronously from localStorage to avoid null flash on Fast Refresh
  const [profileImage, setProfileImageState] = useState(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('profileImage') || null;
  });
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [skipFetch, setSkipFetch] = useState(false); // Prevent multiple fetches

  // Create a unique session ID to detect if provider remounts
  const [sessionId] = useState(() => {
    const id = Math.random().toString(36).substring(7);
    console.log(`🟢 ProfileProvider mounted [Session: ${id}]`);
    return id;
  });

  // Log unmount
  useEffect(() => {
    return () => {
      console.log(`🔴 ProfileProvider unmounted [Session: ${sessionId}]`);
    };
  }, [sessionId]);

  // Load profile from API - but don't overwrite localStorage
  const loadProfile = useCallback(async () => {
      const callId = Math.random().toString(36).substring(7);
      console.log(`[${sessionId}] loadProfile called [Call: ${callId}]`);
    
    try {
      console.log(`[${sessionId}] ProfileContext: Fetching from API... [Call: ${callId}]`);
      setLoading(true);
      const user = await UserService.getProfile();
      console.log(`[${sessionId}] ProfileContext API response [Call: ${callId}]:`, user);
      
      if (user?.profileImage) {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const imageUrl = `${baseURL}${user.profileImage}`;
        console.log(`[${sessionId}] ProfileContext: API returned image [Call: ${callId}]:`, imageUrl.substring(0, 50) + '...');
        
        // Update both state and localStorage
        setProfileImageState(imageUrl);
        // Persist to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('profileImage', imageUrl);
          console.log(`[${sessionId}] ProfileContext: Saved API image to localStorage [Call: ${callId}]`);
        }
      } else {
        console.log(`[${sessionId}] ProfileContext: API returned no image [Call: ${callId}]`);
      }
    } catch (error) {
      console.warn(`[${sessionId}] ProfileContext: API error [Call: ${callId}]: ${error.message || error}`);
      // Don't clear the image on error, silently fail for background refreshes
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Initialize from localStorage on first mount
  useEffect(() => {
    if (typeof window === 'undefined' || skipFetch) return;

    // Monkey-patch localStorage.setItem/removeItem to detect who changes profileImage
    const origSetItem = window.localStorage.setItem.bind(window.localStorage);
    const origRemoveItem = window.localStorage.removeItem.bind(window.localStorage);
    function wrapSetItem(key, value) {
      if (key === 'profileImage') {
        console.log('[localStorage] setItem(profileImage) called. Value startsWith:', typeof value === 'string' ? value.substring(0,50) + '...' : String(value));
        console.log(new Error().stack.split('\n').slice(2,6).join('\n'));
      }
      return origSetItem(key, value);
    }
    function wrapRemoveItem(key) {
      if (key === 'profileImage') {
        console.log('[localStorage] removeItem(profileImage) called. Stack:' );
        console.log(new Error().stack.split('\n').slice(2,6).join('\n'));
      }
      return origRemoveItem(key);
    }
    window.localStorage.setItem = wrapSetItem;
    window.localStorage.removeItem = wrapRemoveItem;

    // Check if we already have an image from sync init
    if (profileImage) {
      console.log('ProfileContext: Image already loaded from localStorage on mount');
      setLoading(false);
    } else {
      console.log('ProfileContext: No image in localStorage, fetching from API');
      // Only fetch if user has a token (is authenticated)
      const token = localStorage.getItem('access_token');
      if (token) {
        loadProfile();
      } else {
        console.log('ProfileContext: No token found, skipping API fetch');
        setLoading(false);
      }
    }
    
    setInitialized(true);
    setSkipFetch(true); // Prevent re-running after initialization
    
    // restore originals on unmount
    return () => {
      try {
        window.localStorage.setItem = origSetItem;
        window.localStorage.removeItem = origRemoveItem;
        console.log('ProfileContext: restored localStorage methods');
      } catch (e) {
        // ignore
      }
    };
  }, []); // Empty dependency array - run only once on mount

  const updateProfileImage = useCallback((newImage) => {
    console.log('ProfileContext.updateProfileImage called with:', newImage ? 'URL' : 'null');

    // Safety check: never clear image if it's in localStorage
    if (!newImage && typeof window !== 'undefined') {
      const stored = localStorage.getItem('profileImage');
      if (stored) {
        console.warn('WARNING: Attempted to clear image, but localStorage has:', stored.substring(0, 50) + '...');
        console.warn('NOT clearing state - keeping localStorage value');
        setProfileImageState(stored);
        return;
      }
    }

    if (newImage) {
      console.log('Setting image:', newImage.substring(0, 50) + '...');
      setProfileImageState(newImage);

      // Persist to localStorage with verification
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('profileImage', newImage);
          const stored = localStorage.getItem('profileImage');
          console.log('localStorage.setItem succeeded:', stored === newImage);
          if (stored !== newImage) {
            console.error('WARNING: localStorage.setItem failed - retrieved value does not match!');
          }
        } catch (error) {
          console.error('localStorage.setItem error:', error);
        }
      }
    } else {
      console.log('Removing image from context');
      setProfileImageState(null);

      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('profileImage');
          console.log('localStorage.removeItem succeeded');
        } catch (error) {
          console.error('localStorage.removeItem error:', error);
        }
      }
    }

    console.log('ProfileContext render, profileImage:', profileImage ? 'SET' : 'NULL');
  }, [profileImage]);

  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage: updateProfileImage, loadProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
}