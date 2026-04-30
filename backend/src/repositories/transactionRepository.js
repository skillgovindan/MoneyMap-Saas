const Income = require("../models/incomeModel");
const Expense = require("../models/expenseModel");

const getIncomeTransactions = (filter) => {
  return Income.find(filter);
};

const getExpenseTransactions = (filter) => {
  return Expense.find(filter);
};

module.exports = {
  getIncomeTransactions,
  getExpenseTransactions,
};
