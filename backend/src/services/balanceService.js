const balanceRepository = require("../repositories/balanceRepository");

const getBalance = async () => {
  try {
    const incomes = await balanceRepository.getAllIncome();
    const expenses = await balanceRepository.getAllExpense();

    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    const currentBalance = totalIncome - totalExpense;

    const balanceData = {
      totalIncome,
      totalExpense,
      currentBalance,
      calculatedAt: new Date(),
    };

    // Save snapshot
    await balanceRepository.createBalanceSnapshot(balanceData);

    return balanceData;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getBalance,
};
