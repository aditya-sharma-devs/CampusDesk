import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('thapar_token');
      const savedUser = localStorage.getItem('thapar_user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Verify with backend
          const res = await api.get('/auth/me');
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('thapar_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed, clear stale session.', err.message);
          // Keep savedUser if offline/dev mode or logout if token explicitly invalid
          if (err.response && err.response.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem('thapar_token', token);
        localStorage.setItem('thapar_user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login request failed. Check server connection.';
      return { success: false, message: msg };
    }
  };

  const signup = async (userData) => {
    try {
      const res = await api.post('/auth/signup', userData);
      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem('thapar_token', token);
        localStorage.setItem('thapar_user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Signup failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup request failed. Check server connection.';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('thapar_token');
    localStorage.removeItem('thapar_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
