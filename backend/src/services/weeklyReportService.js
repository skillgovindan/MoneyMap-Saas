const weeklyReportRepository = require("../repositories/weeklyReportRepository");

const generateWeeklyReport = async (startDateParam, endDateParam) => {
  try {
    if (!startDateParam || !endDateParam) {
      throw new Error("Missing required query params: startDate, endDate");
    }
    
    const weekStartDate = new Date(startDateParam);
    const weekEndDate = new Date(endDateParam);
    
    if (isNaN(weekStartDate.getTime()) || isNaN(weekEndDate.getTime())) {
      throw new Error("Invalid date provided");
    }

    const startDate = new Date(weekStartDate);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(weekEndDate);
    endDate.setUTCHours(23, 59, 59, 999);

    const incomes = await weeklyReportRepository.getIncomeByDateRange(startDate, endDate);
    const expenses = await weeklyReportRepository.getExpenseByDateRange(startDate, endDate);

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
      weekStartDate: startDate,
      weekEndDate: endDate
    };

    return await weeklyReportRepository.createWeeklyReport(reportData);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateWeeklyReport
};
