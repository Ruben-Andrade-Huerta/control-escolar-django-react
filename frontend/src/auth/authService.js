import api from '../api/axios';

export const login = async (email, password) => {
  const res = await api.post('/token/', { email, password });
  localStorage.setItem('access', res.data.access);
  localStorage.setItem('refresh', res.data.refresh);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};

export const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) throw new Error('No refresh token');
  const res = await api.post('/token/refresh/', { refresh });
  localStorage.setItem('access', res.data.access);
  return res.data.access;
};

export const getAccessToken = () => localStorage.getItem('access');
export const getRefreshToken = () => localStorage.getItem('refresh');