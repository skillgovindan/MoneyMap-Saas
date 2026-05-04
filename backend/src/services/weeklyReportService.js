const weeklyReportRepository = require("../repositories/weeklyReportRepository");

const getWeeklyReport = async (tenantDb, startDateStr, endDateStr) => {
  try {
    if (!startDateStr || !endDateStr) {
      throw new Error("startDate and endDate parameters are required (YYYY-MM-DD)");
    }
    
    const startDate = new Date(startDateStr);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(endDateStr);
    endDate.setHours(23, 59, 59, 999);
    
    const incomes = await weeklyReportRepository.getIncomeByDateRange(tenantDb, startDate, endDate);
    const expenses = await weeklyReportRepository.getExpenseByDateRange(startDate, endDate);
    
    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    
    return {
      reportType: "weekly",
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      incomeCount: incomes.length,
      expenseCount: expenses.length
    };
  } catch (error) {
    throw error;
  }
};

module.exports = { getWeeklyReport };
