import apiClient from '../api/apiClient';

export const createPaymentMethod = async (data) => {
  const response = await apiClient.post('/api/payment-methods', data);
  return response.data;
};

export const getAllPaymentMethods = async () => {
  const response = await apiClient.get('/api/payment-methods');
  return response.data;
};

export const getActivePaymentMethods = async () => {
  const response = await apiClient.get('/api/payment-methods/active');
  return response.data;
};

export const getPaymentMethodById = async (id) => {
  const response = await apiClient.get(`/api/payment-methods/${id}`);
  return response.data;
};

export const updatePaymentMethodById = async (id, data) => {
  const response = await apiClient.put(`/api/payment-methods/${id}`, data);
  return response.data;
};

export const patchPaymentMethodById = async (id, data) => {
  const response = await apiClient.patch(`/api/payment-methods/${id}`, data);
  return response.data;
};

export const deletePaymentMethodById = async (id) => {
  const response = await apiClient.delete(`/api/payment-methods/${id}`);
  return response.data;
};
