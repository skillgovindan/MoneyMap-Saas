const dailyReportRepository = require("../repositories/dailyReportRepository");

const getDailyReport = async (tenantDb, dateStr) => {
  try {
    if (!dateStr) {
      throw new Error("date parameter is required (YYYY-MM-DD)");
    }
    
    const startDate = new Date(dateStr);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(dateStr);
    endDate.setHours(23, 59, 59, 999);
    
    const incomes = await dailyReportRepository.getIncomeByDateRange(tenantDb, startDate, endDate);
    const expenses = await dailyReportRepository.getExpenseByDateRange(startDate, endDate);
    
    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    
    return {
      reportType: "daily",
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

module.exports = { getDailyReport };
