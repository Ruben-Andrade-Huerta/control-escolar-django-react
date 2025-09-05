import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, refreshToken, getAccessToken } from './authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setUser({ token });
    }
  }, []);

  const login = async (email, password) => {
    await loginService(email, password);
    setUser({ token: getAccessToken() });
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  // Auto-refresh (Cada 4 minutos)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await refreshToken();
      } catch {
        logout();
      }
    }, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);