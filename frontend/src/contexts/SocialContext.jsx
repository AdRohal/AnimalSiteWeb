import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../utils/api';

const SocialContext = createContext();

export const useSocial = () => {
  const ctx = useContext(SocialContext);
  if (!ctx) throw new Error('useSocial must be used within SocialProvider');
  return ctx;
};

export const SocialProvider = ({ children }) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLinks = useCallback(async () => {
    try {
      const response = await api.get('/social-links');
      setLinks(response.data.links || []);
    } catch (error) {
      console.error('Failed to load social links', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  const getLink = useCallback(
    (platform) => links.find((link) => link.platform === platform)?.url || null,
    [links]
  );

  const saveLink = async (platform, url) => {
    try {
      await api.put(`/social-links/${platform}`, { url });
      await loadLinks();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to save link';
      return { success: false, message };
    }
  };

  return (
    <SocialContext.Provider value={{ links, loading, getLink, saveLink, reload: loadLinks }}>
      {children}
    </SocialContext.Provider>
  );
};
