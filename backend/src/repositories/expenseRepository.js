const Expense = require("../models/expenseModel");

const createExpense = (data) => {
  return Expense.create(data);
};

const getAllExpense = () => {
  return Expense.find().populate("paymentMethod", "name description isActive").sort({ createdAt: -1 });
};

const getExpenseById = (id) => {
  return Expense.findById(id).populate("paymentMethod", "name description isActive");
};

const updateExpenseById = (id, data) => {
  return Expense.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("paymentMethod", "name description isActive");
};

const patchExpenseById = (id, data) => {
  return Expense.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("paymentMethod", "name description isActive");
};

const deleteExpenseById = (id) => {
  return Expense.findByIdAndDelete(id);
};

module.exports = {
  createExpense,
  getAllExpense,
  getExpenseById,
  updateExpenseById,
  patchExpenseById,
  deleteExpenseById,
};
