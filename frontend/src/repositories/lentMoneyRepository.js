import apiClient from '../api/apiClient';

const createLentMoney = async (data) => {
  const response = await apiClient.post('/api/lent-money', data);
  return response.data;
};

const getAllLentMoney = async () => {
  const response = await apiClient.get('/api/lent-money');
  return response.data;
};

const getLentMoneyById = async (id) => {
  const response = await apiClient.get(`/api/lent-money/${id}`);
  return response.data;
};

const updateLentMoneyById = async (id, data) => {
  const response = await apiClient.put(`/api/lent-money/${id}`, data);
  return response.data;
};

const patchLentMoneyById = async (id, data) => {
  const response = await apiClient.patch(`/api/lent-money/${id}`, data);
  return response.data;
};

const deleteLentMoneyById = async (id) => {
  const response = await apiClient.delete(`/api/lent-money/${id}`);
  return response.data;
};

export default {
  createLentMoney,
  getAllLentMoney,
  getLentMoneyById,
  updateLentMoneyById,
  patchLentMoneyById,
  deleteLentMoneyById,
};
