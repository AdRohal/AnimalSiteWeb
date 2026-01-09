import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../utils/api';

const ContactContext = createContext();

export const useContact = () => {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error('useContact must be used within ContactProvider');
  return ctx;
};

export const ContactProvider = ({ children }) => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadContact = useCallback(async () => {
    try {
      const response = await api.get('/contact-info');
      setContact(response.data.contact || {});
    } catch (error) {
      console.error('Failed to load contact info', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContact();
  }, [loadContact]);

  const saveContact = async (payload) => {
    try {
      await api.put('/contact-info', payload);
      await loadContact();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to save contact info';
      return { success: false, message };
    }
  };

  return (
    <ContactContext.Provider value={{ contact, loading, saveContact, reload: loadContact }}>
      {children}
    </ContactContext.Provider>
  );
};
