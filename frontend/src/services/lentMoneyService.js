import lentMoneyRepository from '../repositories/lentMoneyRepository';

const createLentMoney = async (data) => {
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

const getAllLentMoney = async () => {
  try {
    return await lentMoneyRepository.getAllLentMoney();
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch lent money records");
  }
};

const getLentMoneyById = async (id) => {
  try {
    if (!id) throw new Error("id is required");
    return await lentMoneyRepository.getLentMoneyById(id);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch lent money record");
  }
};

const updateLentMoneyById = async (id, data) => {
  try {
    if (!id || !data.person || data.amount === undefined || !data.takenDate) {
      throw new Error("id, person, amount, and takenDate are required");
    }
    if (data.amount <= 0) {
      throw new Error("amount must be greater than 0");
    }
    return await lentMoneyRepository.updateLentMoneyById(id, data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to update lent money record");
  }
};

const patchLentMoneyById = async (id, data) => {
  try {
    if (!id) throw new Error("id is required");
    if (data.amount !== undefined && data.amount <= 0) {
      throw new Error("amount must be greater than 0");
    }
    return await lentMoneyRepository.patchLentMoneyById(id, data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to patch lent money record");
  }
};

const deleteLentMoneyById = async (id) => {
  try {
    if (!id) throw new Error("id is required");
    return await lentMoneyRepository.deleteLentMoneyById(id);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to delete lent money record");
  }
};

export default {
  createLentMoney,
  getAllLentMoney,
  getLentMoneyById,
  updateLentMoneyById,
  patchLentMoneyById,
  deleteLentMoneyById,
};
