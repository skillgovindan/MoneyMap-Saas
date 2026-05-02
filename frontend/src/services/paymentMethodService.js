import * as paymentMethodRepository from '../repositories/paymentMethodRepository';

const extractErrorMessage = (error) => {
  return error.response?.data?.message || error.message || 'An unexpected error occurred.';
};

export const createPaymentMethod = async (data) => {
  try {
    if (!data.name) throw new Error('Payment Method name is required');
    return await paymentMethodRepository.createPaymentMethod(data);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getAllPaymentMethods = async () => {
  try {
    return await paymentMethodRepository.getAllPaymentMethods();
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getActivePaymentMethods = async () => {
  try {
    return await paymentMethodRepository.getActivePaymentMethods();
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getPaymentMethodById = async (id) => {
  try {
    if (!id) throw new Error('ID is required');
    return await paymentMethodRepository.getPaymentMethodById(id);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const updatePaymentMethodById = async (id, data) => {
  try {
    if (!id) throw new Error('ID is required');
    if (!data.name) throw new Error('Payment Method name is required');
    return await paymentMethodRepository.updatePaymentMethodById(id, data);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const patchPaymentMethodById = async (id, data) => {
  try {
    if (!id) throw new Error('ID is required');
    return await paymentMethodRepository.patchPaymentMethodById(id, data);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const deletePaymentMethodById = async (id) => {
  try {
    if (!id) throw new Error('ID is required');
    return await paymentMethodRepository.deletePaymentMethodById(id);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
