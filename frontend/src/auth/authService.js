import api from '../api/axios';

// Claves de almacenamiento namespaced

const LS_TOKEN = 'auth:token';
const LS_REFRESH = 'auth:refresh';

export const login = async (email, password) => {
  const res = await api.post('/token/', { email, password });
  const access = res.data.access;
  const refresh = res.data.refresh;
  localStorage.setItem(LS_TOKEN, access);
  localStorage.setItem(LS_REFRESH, refresh);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem(LS_TOKEN);
  localStorage.removeItem(LS_REFRESH);
};

export const refreshToken = async () => {
  const refresh = localStorage.getItem(LS_REFRESH);
  if (!refresh) throw new Error('No refresh token');
  const res = await api.post('/token/refresh/', { refresh });
  const newAccess = res.data.access;
  localStorage.setItem(LS_TOKEN, newAccess);
  return newAccess;
};

export const getAccessToken = () => localStorage.getItem(LS_TOKEN);
export const getRefreshToken = () => localStorage.getItem(LS_REFRESH);