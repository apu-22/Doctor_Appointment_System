// React imports
import { createContext, useState, useEffect } from 'react';

import * as authApi from '../api/authApi';

// Context creation
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // User load check
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []); 

  // User load function
  const loadUser = async () => {
    try {
      const data = await authApi.getCurrentUser();

      setUser(data.user);

    } catch (error) {
      console.error('User load failed:', error);

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      setUser(null);

    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const data = await authApi.login({ email, password });

      localStorage.setItem('token', data.token);

      setUser(data.user);

      return { success: true, user: data.user };

    } catch (error) {
      console.error('Login failed:', error);

      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  // register Function 
  const register = async (userData) => {
    try {
      const data = await authApi.register(userData);

      localStorage.setItem('token', data.token);

      setUser(data.user);

      return { success: true, user: data.user };

    } catch (error) {
      console.error('Register failed:', error);
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  // logout Function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);
  };

  // Context Value
  const value = {
    user,                     
    loading,                 
    login,                    
    register,                 
    logout,                   
    isAuthenticated: !!user,  
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
