const yearlyReportRepository = require("../repositories/yearlyReportRepository");

const generateYearlyReport = async (yearParam) => {
  try {
    if (!yearParam) {
      throw new Error("Missing required query param: year");
    }

    const year = parseInt(yearParam, 10);
    if (isNaN(year)) {
      throw new Error("Invalid year provided");
    }

    const startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

    const incomes = await yearlyReportRepository.getIncomeByDateRange(startDate, endDate);
    const expenses = await yearlyReportRepository.getExpenseByDateRange(startDate, endDate);

    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    const balance = totalIncome - totalExpense;
    const incomeCount = incomes.length;
    const expenseCount = expenses.length;

    const reportData = {
      startDate,
      endDate,
      totalIncome,
      totalExpense,
      balance,
      incomeCount,
      expenseCount,
      year
    };

    return await yearlyReportRepository.createYearlyReport(reportData);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateYearlyReport
};
