import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../utils/api';

const BankingContext = createContext();

export const useBanking = () => {
  const ctx = useContext(BankingContext);
  if (!ctx) throw new Error('useBanking must be used within BankingProvider');
  return ctx;
};

export const BankingProvider = ({ children }) => {
  const [banking, setBanking] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadBanking = useCallback(async () => {
    try {
      const response = await api.get('/banking-info');
      setBanking(response.data.banking || {});
    } catch (error) {
      console.error('Failed to load banking info', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanking();
  }, [loadBanking]);

  const saveBanking = async (payload) => {
    try {
      await api.put('/banking-info', payload);
      await loadBanking();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to save banking info';
      return { success: false, message };
    }
  };

  return (
    <BankingContext.Provider value={{ banking, loading, saveBanking, reload: loadBanking }}>
      {children}
    </BankingContext.Provider>
  );
};
