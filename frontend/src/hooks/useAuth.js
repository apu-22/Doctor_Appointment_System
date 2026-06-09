// React useContext import 
import { useContext } from 'react';

// AuthContext import
import { AuthContext } from '../context/AuthContext';

// custom hook 
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
};