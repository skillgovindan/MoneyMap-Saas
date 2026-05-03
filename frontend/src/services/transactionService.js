import transactionRepository from "../repositories/transactionRepository";

const getTransactions = async () => {
  try {
    return await transactionRepository.getTransactions();
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch transactions");
  }
};

export default {
  getTransactions,
};
