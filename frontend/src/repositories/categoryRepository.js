import apiClient from '../api/apiClient';

export const createCategory = async (data) => {
  const response = await apiClient.post('/api/categories', data);
  return response.data;
};

export const getAllCategories = async () => {
  const response = await apiClient.get('/api/categories');
  return response.data;
};

export const getCategoriesByType = async (type) => {
  const response = await apiClient.get(`/api/categories/type/${type}`);
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await apiClient.get(`/api/categories/${id}`);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await apiClient.put(`/api/categories/${id}`, data);
  return response.data;
};

export const patchCategory = async (id, data) => {
  const response = await apiClient.patch(`/api/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/api/categories/${id}`);
  return response.data;
};
