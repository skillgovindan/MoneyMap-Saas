const Income = require("../models/incomeModel");
const Expense = require("../models/expenseModel");
const Balance = require("../models/balanceModel");

const getAllIncome = () => {
  return Income.find();
};

const getAllExpense = () => {
  return Expense.find();
};

const createBalanceSnapshot = (data) => {
  return Balance.create(data);
};

const getLatestBalanceSnapshot = () => {
  return Balance.findOne().sort({ createdAt: -1 });
};

module.exports = {
  getAllIncome,
  getAllExpense,
  createBalanceSnapshot,
  getLatestBalanceSnapshot,
};
