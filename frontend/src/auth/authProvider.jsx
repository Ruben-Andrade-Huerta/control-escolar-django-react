import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, refreshToken, getAccessToken, getRefreshToken } from './authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const token = getAccessToken();
        if (token) {
          setUser({ token });
        } else {
          const refresh = getRefreshToken();
          if (refresh) {
            const newToken = await refreshToken();
            setUser({ token: newToken });
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        logoutService();
        setUser(null);
      } finally {
        setIsLoading(false); 
      }
    };

    init();
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
    <AuthContext.Provider value={{ user, login, logout ,isAuthenticated: !!user, isLoading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);