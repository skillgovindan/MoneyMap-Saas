const dailyReportRepository = require("../repositories/dailyReportRepository");

const generateDailyReport = async (dateParam) => {
  try {
    if (!dateParam) {
      throw new Error("Missing required query param: date");
    }
    const reportDate = new Date(dateParam);
    if (isNaN(reportDate.getTime())) {
      throw new Error("Invalid date provided");
    }

    const startDate = new Date(reportDate);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(reportDate);
    endDate.setUTCHours(23, 59, 59, 999);

    const incomes = await dailyReportRepository.getIncomeByDateRange(startDate, endDate);
    const expenses = await dailyReportRepository.getExpenseByDateRange(startDate, endDate);

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
      reportDate
    };

    return await dailyReportRepository.createDailyReport(reportData);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateDailyReport
};
