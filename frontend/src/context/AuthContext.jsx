
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const data = await userAPI.getProfile();
      if (data.error) {
        logout();
      } else {
        setUser(data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials);
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        await fetchUserProfile();
        return { success: true, role: data.role };
      }
      return { success: false, message: data.error || 'Login failed' };
    } catch (error) {
      return { success: false, message: 'Connection error' };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        await fetchUserProfile();
        return { success: true, role: data.role };
      }
      return { success: false, message: data.error || 'Registration failed' };
    } catch (error) {
      return { success: false, message: 'Connection error' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};