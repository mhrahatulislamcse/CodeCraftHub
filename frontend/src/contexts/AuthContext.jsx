import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('codecrafthub_token');
      const storedUser = localStorage.getItem('codecrafthub_user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to parse cached auth state:', err);
      localStorage.removeItem('codecrafthub_token');
      localStorage.removeItem('codecrafthub_user');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch latest current user profile from backend
  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('codecrafthub_user', JSON.stringify(res.data.user));
        return res.data.user;
      }
    } catch (err) {
      console.warn('Failed to refresh user profile:', err);
    }
    return null;
  }, []);

  // Login handler
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.user && res.data?.tokens?.accessToken) {
      const { user: userData, tokens } = res.data;
      setUser(userData);
      setToken(tokens.accessToken);
      localStorage.setItem('codecrafthub_token', tokens.accessToken);
      localStorage.setItem('codecrafthub_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.message || 'Login failed');
  };

  // Register handler
  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data?.user && res.data?.tokens?.accessToken) {
      const { user: userData, tokens } = res.data;
      setUser(userData);
      setToken(tokens.accessToken);
      localStorage.setItem('codecrafthub_token', tokens.accessToken);
      localStorage.setItem('codecrafthub_user', JSON.stringify(userData));
      return userData;
    }
    return res.data;
  };

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('codecrafthub_token');
      localStorage.removeItem('codecrafthub_user');
    }
  }, []);

  // Update profile
  const updateProfile = async (profileData) => {
    const res = await api.put('/users/profile', profileData);
    if (res.data?.user) {
      setUser(res.data.user);
      localStorage.setItem('codecrafthub_user', JSON.stringify(res.data.user));
      return res.data.user;
    }
    return null;
  };

  // Dev utility to simulate role switching in UI preview mode
  const switchMockRole = (roleName) => {
    if (!user) {
      const mockUser = {
        id: 'mock-user-preview',
        email: `${roleName}@codecrafthub.dev`,
        firstName: roleName.charAt(0).toUpperCase() + roleName.slice(1),
        lastName: 'Demo',
        role: roleName,
        avatarUrl: null
      };
      setUser(mockUser);
      localStorage.setItem('codecrafthub_user', JSON.stringify(mockUser));
    } else {
      const updated = { ...user, role: roleName };
      setUser(updated);
      localStorage.setItem('codecrafthub_user', JSON.stringify(updated));
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    role: user?.role || 'guest',
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    switchMockRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

