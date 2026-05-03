import apiClient from '../api/apiClient';

const createBorrowedMoney = async (data) => {
  const response = await apiClient.post('/api/borrowed-money', data);
  return response.data;
};

const getAllBorrowedMoney = async () => {
  const response = await apiClient.get('/api/borrowed-money');
  return response.data;
};

const getBorrowedMoneyById = async (id) => {
  const response = await apiClient.get(`/api/borrowed-money/${id}`);
  return response.data;
};

const updateBorrowedMoneyById = async (id, data) => {
  const response = await apiClient.put(`/api/borrowed-money/${id}`, data);
  return response.data;
};

const patchBorrowedMoneyById = async (id, data) => {
  const response = await apiClient.patch(`/api/borrowed-money/${id}`, data);
  return response.data;
};

const deleteBorrowedMoneyById = async (id) => {
  const response = await apiClient.delete(`/api/borrowed-money/${id}`);
  return response.data;
};

export default {
  createBorrowedMoney,
  getAllBorrowedMoney,
  getBorrowedMoneyById,
  updateBorrowedMoneyById,
  patchBorrowedMoneyById,
  deleteBorrowedMoneyById,
};
