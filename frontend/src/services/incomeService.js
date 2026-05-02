import * as incomeRepository from '../repositories/incomeRepository';

const extractErrorMessage = (error) => {
  return error.response?.data?.message || error.message || 'An unexpected error occurred.';
};

export const createIncome = async (data) => {
  try {
    const { title, amount, category, date } = data;

    if (!title) throw new Error('Title is required');
    if (amount === undefined || amount === null) throw new Error('Amount is required');
    if (Number(amount) <= 0) throw new Error('Amount must be greater than 0');
    if (!category) throw new Error('Category is required');
    if (!date) throw new Error('Date is required');

    return await incomeRepository.createIncome(data);
  } catch (error) {
    if (error.response) {
      throw new Error(extractErrorMessage(error));
    }
    throw error;
  }
};

export const getAllIncome = async () => {
  try {
    return await incomeRepository.getAllIncome();
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getIncomeById = async (id) => {
  try {
    if (!id) throw new Error('ID is required');
    return await incomeRepository.getIncomeById(id);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const updateIncome = async (id, data) => {
  try {
    if (!id) throw new Error('ID is required');
    
    const { title, amount, category, date } = data;

    if (!title) throw new Error('Title is required');
    if (amount === undefined || amount === null) throw new Error('Amount is required');
    if (Number(amount) <= 0) throw new Error('Amount must be greater than 0');
    if (!category) throw new Error('Category is required');
    if (!date) throw new Error('Date is required');

    return await incomeRepository.updateIncome(id, data);
  } catch (error) {
    if (error.response) {
      throw new Error(extractErrorMessage(error));
    }
    throw error;
  }
};

export const patchIncome = async (id, data) => {
  try {
    if (!id) throw new Error('ID is required');

    if (data.amount !== undefined && data.amount !== null) {
      if (Number(data.amount) <= 0) {
        throw new Error('Amount must be greater than 0');
      }
    }

    return await incomeRepository.patchIncome(id, data);
  } catch (error) {
    if (error.response) {
      throw new Error(extractErrorMessage(error));
    }
    throw error;
  }
};

export const deleteIncome = async (id) => {
  try {
    if (!id) throw new Error('ID is required');
    return await incomeRepository.deleteIncome(id);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
