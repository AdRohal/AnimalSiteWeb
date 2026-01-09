const STORAGE_KEY = 'token';
const COOKIE_NAME = 'admin_token';
const MAX_AGE_DAYS = 30;

const getExpiry = () => {
  const expires = new Date();
  expires.setDate(expires.getDate() + MAX_AGE_DAYS);
  return expires.toUTCString();
};

export const getToken = () => {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;

  const match = document.cookie
    .split('; ')
    .find((token) => token.startsWith(`${COOKIE_NAME}=`));

  if (!match) return null;

  return decodeURIComponent(match.split('=')[1]);
};

export const setToken = (token) => {
  if (typeof window === 'undefined') return;

  localStorage.setItem(STORAGE_KEY, token);
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; expires=${getExpiry()}; path=/; SameSite=Lax`;
};

export const clearToken = () => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(STORAGE_KEY);
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
};