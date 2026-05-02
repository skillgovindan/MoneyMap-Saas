import apiClient from '../api/apiClient';

export const createExpense = async (data) => {
  const response = await apiClient.post('/api/expense', data);
  return response.data;
};

export const getAllExpense = async () => {
  const response = await apiClient.get('/api/expense');
  return response.data;
};

export const getExpenseById = async (id) => {
  const response = await apiClient.get(`/api/expense/${id}`);
  return response.data;
};

export const updateExpense = async (id, data) => {
  const response = await apiClient.put(`/api/expense/${id}`, data);
  return response.data;
};

export const patchExpense = async (id, data) => {
  const response = await apiClient.patch(`/api/expense/${id}`, data);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await apiClient.delete(`/api/expense/${id}`);
  return response.data;
};
