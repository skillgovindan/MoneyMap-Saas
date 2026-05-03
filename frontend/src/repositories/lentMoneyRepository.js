import apiClient from '../api/apiClient';

export const createLentMoney = async (data) => {
  const response = await apiClient.post('/api/lent-money', data);
  return response.data;
};

export const getAllLentMoney = async () => {
  const response = await apiClient.get('/api/lent-money');
  return response.data;
};

export const getLentMoneyById = async (id) => {
  const response = await apiClient.get(`/api/lent-money/${id}`);
  return response.data;
};

export const updateLentMoney = async (id, data) => {
  const response = await apiClient.put(`/api/lent-money/${id}`, data);
  return response.data;
};

export const patchLentMoney = async (id, data) => {
  const response = await apiClient.patch(`/api/lent-money/${id}`, data);
  return response.data;
};

export const deleteLentMoney = async (id) => {
  const response = await apiClient.delete(`/api/lent-money/${id}`);
  return response.data;
};

// Aliases for backwards compatibility
export const updateLentMoneyById = updateLentMoney;
export const patchLentMoneyById = patchLentMoney;
export const deleteLentMoneyById = deleteLentMoney;

export default {
  createLentMoney,
  getAllLentMoney,
  getLentMoneyById,
  updateLentMoney,
  patchLentMoney,
  deleteLentMoney,
  updateLentMoneyById,
  patchLentMoneyById,
  deleteLentMoneyById
};
