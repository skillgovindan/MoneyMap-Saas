import apiClient from '../api/apiClient';

export const createIncome = async (data) => {
  const response = await apiClient.post('/api/income', data);
  return response.data;
};

export const getAllIncome = async () => {
  const response = await apiClient.get('/api/income');
  return response.data;
};

export const getIncomeById = async (id) => {
  const response = await apiClient.get(`/api/income/${id}`);
  return response.data;
};

export const updateIncome = async (id, data) => {
  const response = await apiClient.put(`/api/income/${id}`, data);
  return response.data;
};

export const patchIncome = async (id, data) => {
  const response = await apiClient.patch(`/api/income/${id}`, data);
  return response.data;
};

export const deleteIncome = async (id) => {
  const response = await apiClient.delete(`/api/income/${id}`);
  return response.data;
};
