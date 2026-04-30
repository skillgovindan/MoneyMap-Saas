const monthlyReportRepository = require("../repositories/monthlyReportRepository");

const generateMonthlyReport = async (yearParam, monthParam) => {
  try {
    if (!yearParam || !monthParam) {
      throw new Error("Missing required query params: year, month");
    }

    const year = parseInt(yearParam, 10);
    const month = parseInt(monthParam, 10);

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      throw new Error("Invalid year or month provided. Month should be 1 to 12.");
    }

    // JS months are 0-indexed, so month - 1
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)); // Day 0 gives last day of previous month, which is the exact month here since we provide `month`

    const incomes = await monthlyReportRepository.getIncomeByDateRange(startDate, endDate);
    const expenses = await monthlyReportRepository.getExpenseByDateRange(startDate, endDate);

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
      month,
      year
    };

    return await monthlyReportRepository.createMonthlyReport(reportData);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateMonthlyReport
};
