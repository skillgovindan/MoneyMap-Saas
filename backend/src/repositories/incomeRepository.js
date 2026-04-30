const Income = require("../models/incomeModel");

const createIncome = (data) => {
  return Income.create(data);
};

const getAllIncome = () => {
  return Income.find().populate("paymentMethod", "name description isActive").sort({ createdAt: -1 });
};

const getIncomeById = (id) => {
  return Income.findById(id).populate("paymentMethod", "name description isActive");
};

const updateIncomeById = (id, data) => {
  return Income.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("paymentMethod", "name description isActive");
};

const patchIncomeById = (id, data) => {
  return Income.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("paymentMethod", "name description isActive");
};

const deleteIncomeById = (id) => {
  return Income.findByIdAndDelete(id);
};

module.exports = {
  createIncome,
  getAllIncome,
  getIncomeById,
  updateIncomeById,
  patchIncomeById,
  deleteIncomeById,
};
