import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import { fallbackBanking } from '../utils/fallbackData';

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
    setBanking(fallbackBanking);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBanking();
  }, [loadBanking]);

  const saveBanking = async () => ({ success: false, message: 'Frontend-only mode' });

  return (
    <BankingContext.Provider value={{ banking, loading, saveBanking, reload: loadBanking }}>
      {children}
    </BankingContext.Provider>
  );
};
