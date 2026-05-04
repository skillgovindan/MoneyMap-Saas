const yearlyReportRepository = require("../repositories/yearlyReportRepository");

const getYearlyReport = async (tenantDb, yearStr) => {
  try {
    if (!yearStr) {
      throw new Error("year parameter is required");
    }
    
    const year = parseInt(yearStr, 10);
    
    // Jan 1st
    const startDate = new Date(year, 0, 1);
    startDate.setHours(0, 0, 0, 0);
    
    // Dec 31st
    const endDate = new Date(year, 11, 31);
    endDate.setHours(23, 59, 59, 999);
    
    const incomes = await yearlyReportRepository.getIncomeByDateRange(tenantDb, startDate, endDate);
    const expenses = await yearlyReportRepository.getExpenseByDateRange(startDate, endDate);
    
    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    
    return {
      reportType: "yearly",
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

module.exports = { getYearlyReport };
