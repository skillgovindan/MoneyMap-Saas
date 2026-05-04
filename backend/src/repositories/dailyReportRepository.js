const incomeSchema = require("../models/incomeModel");
const Expense = require("../models/expenseModel"); // Expense is still a global model

const getIncomeByDateRange = (tenantDb, startDate, endDate) => {
  const Income = tenantDb.model("Income", incomeSchema);
  return Income.find({ date: { $gte: startDate, $lte: endDate } });
};

const getExpenseByDateRange = (startDate, endDate) => {
  // Expense is not tenant-scoped yet
  return Expense.find({ date: { $gte: startDate, $lte: endDate } });
};

module.exports = {
  getIncomeByDateRange,
  getExpenseByDateRange,
};
