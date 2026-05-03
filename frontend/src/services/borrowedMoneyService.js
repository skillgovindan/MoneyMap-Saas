import borrowedMoneyRepository from '../repositories/borrowedMoneyRepository';

export const createBorrowedMoney = async (data) => {
  try {
    if (!data.person || data.amount === undefined || !data.takenDate) {
      throw new Error("person, amount, and takenDate are required");
    }
    if (data.amount <= 0) {
      throw new Error("amount must be greater than 0");
    }
    return await borrowedMoneyRepository.createBorrowedMoney(data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to create borrowed money record");
  }
};

export const getAllBorrowedMoney = async () => {
  try {
    return await borrowedMoneyRepository.getAllBorrowedMoney();
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch borrowed money records");
  }
};

export const getBorrowedMoneyById = async (id) => {
  try {
    if (!id) throw new Error("id is required");
    return await borrowedMoneyRepository.getBorrowedMoneyById(id);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch borrowed money record");
  }
};

export const updateBorrowedMoney = async (id, data) => {
  try {
    if (!id || !data.person || data.amount === undefined || !data.takenDate) {
      throw new Error("id, person, amount, and takenDate are required");
    }
    if (data.amount <= 0) {
      throw new Error("amount must be greater than 0");
    }
    return await borrowedMoneyRepository.updateBorrowedMoney(id, data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to update borrowed money record");
  }
};

export const patchBorrowedMoney = async (id, data) => {
  try {
    if (!id) throw new Error("id is required");
    if (data.amount !== undefined && data.amount <= 0) {
      throw new Error("amount must be greater than 0");
    }
    return await borrowedMoneyRepository.patchBorrowedMoney(id, data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to patch borrowed money record");
  }
};

export const deleteBorrowedMoney = async (id) => {
  try {
    if (!id) throw new Error("id is required");
    return await borrowedMoneyRepository.deleteBorrowedMoney(id);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to delete borrowed money record");
  }
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
