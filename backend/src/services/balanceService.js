const balanceRepository = require("../repositories/balanceRepository");

const getBalance = async () => {
  try {
    const incomes = await balanceRepository.getAllIncome();
    const expenses = await balanceRepository.getAllExpense();
    const lentMoneys = await balanceRepository.getAllLentMoney();
    const borrowedMoneys = await balanceRepository.getAllBorrowedMoney();

    const totalIncome = incomes.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalExpense = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);

    const pendingLentMoney = lentMoneys
      .filter((item) => item.isPaid === false)
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    const pendingBorrowedMoney = borrowedMoneys
      .filter((item) => item.isPaid === false)
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    const currentBalance = totalIncome - totalExpense - pendingLentMoney + pendingBorrowedMoney;

    const balanceData = {
      totalIncome,
      totalExpense,
      pendingLentMoney,
      pendingBorrowedMoney,
      currentBalance,
      calculatedAt: new Date(),
    };

    await balanceRepository.createBalanceSnapshot(balanceData);

    return balanceData;
  } catch (error) {
    throw new Error(error.message || "Failed to calculate balance");
  }
};

module.exports = {
  getBalance,
};
