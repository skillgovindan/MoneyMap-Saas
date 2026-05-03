import lentMoneyRepository from '../repositories/lentMoneyRepository';

export const createLentMoney = async (data) => {
  try {
    if (!data.person || data.amount === undefined || !data.takenDate) {
      throw new Error("person, amount, and takenDate are required");
    }
    if (data.amount <= 0) {
      throw new Error("amount must be greater than 0");
    }
    return await lentMoneyRepository.createLentMoney(data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to create lent money record");
  }
};

export const getAllLentMoney = async () => {
  try {
    return await lentMoneyRepository.getAllLentMoney();
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch lent money records");
  }
};

export const getLentMoneyById = async (id) => {
  try {
    if (!id) throw new Error("id is required");
    return await lentMoneyRepository.getLentMoneyById(id);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch lent money record");
  }
};

export const updateLentMoney = async (id, data) => {
  try {
    if (!id || !data.person || data.amount === undefined || !data.takenDate) {
      throw new Error("id, person, amount, and takenDate are required");
    }
    if (data.amount <= 0) {
      throw new Error("amount must be greater than 0");
    }
    return await lentMoneyRepository.updateLentMoney(id, data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to update lent money record");
  }
};

export const patchLentMoney = async (id, data) => {
  try {
    if (!id) throw new Error("id is required");
    if (data.amount !== undefined && data.amount <= 0) {
      throw new Error("amount must be greater than 0");
    }
    return await lentMoneyRepository.patchLentMoney(id, data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to patch lent money record");
  }
};

export const deleteLentMoney = async (id) => {
  try {
    if (!id) throw new Error("id is required");
    return await lentMoneyRepository.deleteLentMoney(id);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to delete lent money record");
  }
};

// Aliases for backwards compatibility
export const updateLentMoneyById = updateLentMoney;
export const patchLentMoneyById = patchLentMoney;
export const deleteLentMoneyById = deleteLentMoney;

export default {
  createLentMoney,
  getAllLentMoney,
  getLentMoneyById,
  updateLentMoney,
  patchLentMoney,
  deleteLentMoney,
  updateLentMoneyById,
  patchLentMoneyById,
  deleteLentMoneyById
};
