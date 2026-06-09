import api from './axios';

//Register API call
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data; 
};

//Login API call
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

//Get Current User
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};