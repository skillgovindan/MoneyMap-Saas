const incomeSchema = require("../models/incomeModel");
const Expense = require("../models/expenseModel");

const getIncomeByDateRange = (tenantDb, startDate, endDate) => {
  const Income = tenantDb.model("Income", incomeSchema);
  return Income.find({ date: { $gte: startDate, $lte: endDate } });
};

const getExpenseByDateRange = (startDate, endDate) => {
  return Expense.find({ date: { $gte: startDate, $lte: endDate } });
};

module.exports = {
  getIncomeByDateRange,
  getExpenseByDateRange,
};
