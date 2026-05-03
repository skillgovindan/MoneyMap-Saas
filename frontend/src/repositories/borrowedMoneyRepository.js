import apiClient from '../api/apiClient';

export const createBorrowedMoney = async (data) => {
  const response = await apiClient.post('/api/borrowed-money', data);
  return response.data;
};

export const getAllBorrowedMoney = async () => {
  const response = await apiClient.get('/api/borrowed-money');
  return response.data;
};

export const getBorrowedMoneyById = async (id) => {
  const response = await apiClient.get(`/api/borrowed-money/${id}`);
  return response.data;
};

export const updateBorrowedMoney = async (id, data) => {
  const response = await apiClient.put(`/api/borrowed-money/${id}`, data);
  return response.data;
};

export const patchBorrowedMoney = async (id, data) => {
  const response = await apiClient.patch(`/api/borrowed-money/${id}`, data);
  return response.data;
};

export const deleteBorrowedMoney = async (id) => {
  const response = await apiClient.delete(`/api/borrowed-money/${id}`);
  return response.data;
};

// Aliases for backwards compatibility
export const updateBorrowedMoneyById = updateBorrowedMoney;
export const patchBorrowedMoneyById = patchBorrowedMoney;
export const deleteBorrowedMoneyById = deleteBorrowedMoney;

export default {
  createBorrowedMoney,
  getAllBorrowedMoney,
  getBorrowedMoneyById,
  updateBorrowedMoney,
  patchBorrowedMoney,
  deleteBorrowedMoney,
  updateBorrowedMoneyById,
  patchBorrowedMoneyById,
  deleteBorrowedMoneyById
};
