import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import { fallbackSocialLinks } from '../utils/fallbackData';

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
      setLinks(response.data.links || fallbackSocialLinks);
    } catch (error) {
      console.warn('Using fallback social links for frontend-only mode.');
      setLinks(fallbackSocialLinks);
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

  const saveLink = async () => ({ success: false, message: 'Frontend-only mode' });

  return (
    <SocialContext.Provider value={{ links, loading, getLink, saveLink, reload: loadLinks }}>
      {children}
    </SocialContext.Provider>
  );
};
