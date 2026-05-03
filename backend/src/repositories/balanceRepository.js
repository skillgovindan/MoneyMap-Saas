const Income = require("../models/incomeModel");
const Expense = require("../models/expenseModel");
const LentMoney = require("../models/lentMoneyModel");
const BorrowedMoney = require("../models/borrowedMoneyModel");
const Balance = require("../models/balanceModel");

const getAllIncome = () => {
  return Income.find();
};

const getAllExpense = () => {
  return Expense.find();
};

const getAllLentMoney = () => {
  return LentMoney.find();
};

const getAllBorrowedMoney = () => {
  return BorrowedMoney.find();
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
  getAllLentMoney,
  getAllBorrowedMoney,
  createBalanceSnapshot,
  getLatestBalanceSnapshot,
};
