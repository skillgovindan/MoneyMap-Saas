import apiClient from '../api/apiClient';

export const registerUser = async (data) => {
  const response = await apiClient.post('/api/auth/register', data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await apiClient.post('/api/auth/login', data);
  return response.data;
};

export const getProfile = async () => {
  const response = await apiClient.get('/api/auth/profile');
  return response.data;
};
