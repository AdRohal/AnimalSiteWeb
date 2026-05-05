import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import { fallbackContact } from '../utils/fallbackData';

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
    setContact(fallbackContact);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadContact();
  }, [loadContact]);

  const saveContact = async () => ({ success: false, message: 'Frontend-only mode' });

  return (
    <ContactContext.Provider value={{ contact, loading, saveContact, reload: loadContact }}>
      {children}
    </ContactContext.Provider>
  );
};
