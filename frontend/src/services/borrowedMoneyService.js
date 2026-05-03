import borrowedMoneyRepository from '../repositories/borrowedMoneyRepository';

const createBorrowedMoney = async (data) => {
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

const getAllBorrowedMoney = async () => {
  try {
    return await borrowedMoneyRepository.getAllBorrowedMoney();
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch borrowed money records");
  }
};

const getBorrowedMoneyById = async (id) => {
  try {
    if (!id) throw new Error("id is required");
    return await borrowedMoneyRepository.getBorrowedMoneyById(id);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch borrowed money record");
  }
};

const updateBorrowedMoneyById = async (id, data) => {
  try {
    if (!id || !data.person || data.amount === undefined || !data.takenDate) {
      throw new Error("id, person, amount, and takenDate are required");
    }
    if (data.amount <= 0) {
      throw new Error("amount must be greater than 0");
    }
    return await borrowedMoneyRepository.updateBorrowedMoneyById(id, data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to update borrowed money record");
  }
};

const patchBorrowedMoneyById = async (id, data) => {
  try {
    if (!id) throw new Error("id is required");
    if (data.amount !== undefined && data.amount <= 0) {
      throw new Error("amount must be greater than 0");
    }
    return await borrowedMoneyRepository.patchBorrowedMoneyById(id, data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to patch borrowed money record");
  }
};

const deleteBorrowedMoneyById = async (id) => {
  try {
    if (!id) throw new Error("id is required");
    return await borrowedMoneyRepository.deleteBorrowedMoneyById(id);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to delete borrowed money record");
  }
};

export default {
  createBorrowedMoney,
  getAllBorrowedMoney,
  getBorrowedMoneyById,
  updateBorrowedMoneyById,
  patchBorrowedMoneyById,
  deleteBorrowedMoneyById,
};
