import * as expenseRepository from '../repositories/expenseRepository';

const extractErrorMessage = (error) => {
  return error.response?.data?.message || error.message || 'An unexpected error occurred.';
};

export const createExpense = async (data) => {
  try {
    const { title, amount, category, date } = data;

    if (!title) throw new Error('Title is required');
    if (amount === undefined || amount === null) throw new Error('Amount is required');
    if (Number(amount) <= 0) throw new Error('Amount must be greater than 0');
    if (!category) throw new Error('Category is required');
    if (!date) throw new Error('Date is required');

    return await expenseRepository.createExpense(data);
  } catch (error) {
    if (error.response) {
      throw new Error(extractErrorMessage(error));
    }
    throw error;
  }
};

export const getAllExpense = async () => {
  try {
    return await expenseRepository.getAllExpense();
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getExpenseById = async (id) => {
  try {
    if (!id) throw new Error('ID is required');
    return await expenseRepository.getExpenseById(id);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const updateExpense = async (id, data) => {
  try {
    if (!id) throw new Error('ID is required');
    
    const { title, amount, category, date } = data;

    if (!title) throw new Error('Title is required');
    if (amount === undefined || amount === null) throw new Error('Amount is required');
    if (Number(amount) <= 0) throw new Error('Amount must be greater than 0');
    if (!category) throw new Error('Category is required');
    if (!date) throw new Error('Date is required');

    return await expenseRepository.updateExpense(id, data);
  } catch (error) {
    if (error.response) {
      throw new Error(extractErrorMessage(error));
    }
    throw error;
  }
};

export const patchExpense = async (id, data) => {
  try {
    if (!id) throw new Error('ID is required');

    if (data.amount !== undefined && data.amount !== null) {
      if (Number(data.amount) <= 0) {
        throw new Error('Amount must be greater than 0');
      }
    }

    return await expenseRepository.patchExpense(id, data);
  } catch (error) {
    if (error.response) {
      throw new Error(extractErrorMessage(error));
    }
    throw error;
  }
};

export const deleteExpense = async (id) => {
  try {
    if (!id) throw new Error('ID is required');
    return await expenseRepository.deleteExpense(id);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
