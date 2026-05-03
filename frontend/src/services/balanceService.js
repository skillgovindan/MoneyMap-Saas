import balanceRepository from "../repositories/balanceRepository";

const getBalance = async () => {
  try {
    return await balanceRepository.getBalance();
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch balance");
  }
};

export default {
  getBalance,
};
