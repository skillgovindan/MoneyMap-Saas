const monthlyReportRepository = require("../repositories/monthlyReportRepository");

const getMonthlyReport = async (tenantDb, yearStr, monthStr) => {
  try {
    if (!yearStr || !monthStr) {
      throw new Error("year and month parameters are required");
    }
    
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1; // JS months are 0-11
    
    // First day of the month
    const startDate = new Date(year, month, 1);
    startDate.setHours(0, 0, 0, 0);
    
    // Last day of the month
    const endDate = new Date(year, month + 1, 0);
    endDate.setHours(23, 59, 59, 999);
    
    const incomes = await monthlyReportRepository.getIncomeByDateRange(tenantDb, startDate, endDate);
    const expenses = await monthlyReportRepository.getExpenseByDateRange(startDate, endDate);
    
    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    
    return {
      reportType: "monthly",
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

module.exports = { getMonthlyReport };
