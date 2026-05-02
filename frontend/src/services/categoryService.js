import * as categoryRepository from '../repositories/categoryRepository';

const extractErrorMessage = (error) => {
  return error.response?.data?.message || error.message || 'An unexpected error occurred.';
};

export const createCategory = async (data) => {
  try {
    const { name, type } = data;

    if (!name) throw new Error('Name is required');
    if (!type) throw new Error('Type is required');
    if (type !== 'income' && type !== 'expense') {
      throw new Error('Type must be either "income" or "expense"');
    }

    return await categoryRepository.createCategory(data);
  } catch (error) {
    if (error.response) {
      throw new Error(extractErrorMessage(error));
    }
    throw error;
  }
};

export const getAllCategories = async () => {
  try {
    return await categoryRepository.getAllCategories();
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getCategoriesByType = async (type) => {
  try {
    if (!type) throw new Error('Type is required');
    if (type !== 'income' && type !== 'expense') {
      throw new Error('Type must be either "income" or "expense"');
    }

    return await categoryRepository.getCategoriesByType(type);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getCategoryById = async (id) => {
  try {
    if (!id) throw new Error('ID is required');
    return await categoryRepository.getCategoryById(id);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const updateCategory = async (id, data) => {
  try {
    if (!id) throw new Error('ID is required');

    const { name, type } = data;

    if (!name) throw new Error('Name is required');
    if (!type) throw new Error('Type is required');
    if (type !== 'income' && type !== 'expense') {
      throw new Error('Type must be either "income" or "expense"');
    }

    return await categoryRepository.updateCategory(id, data);
  } catch (error) {
    if (error.response) {
      throw new Error(extractErrorMessage(error));
    }
    throw error;
  }
};

export const patchCategory = async (id, data) => {
  try {
    if (!id) throw new Error('ID is required');

    if (data.type !== undefined) {
      if (data.type !== 'income' && data.type !== 'expense') {
        throw new Error('Type must be either "income" or "expense"');
      }
    }

    return await categoryRepository.patchCategory(id, data);
  } catch (error) {
    if (error.response) {
      throw new Error(extractErrorMessage(error));
    }
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    if (!id) throw new Error('ID is required');
    return await categoryRepository.deleteCategory(id);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
