const BorrowedMoney = require("../models/borrowedMoneyModel");

const createBorrowedMoney = async (data) => {
  return await BorrowedMoney.create(data);
};

const getAllBorrowedMoney = async () => {
  return await BorrowedMoney.find().sort({ createdAt: -1 }).populate("person", "name address phoneNumber").populate("category", "name type");
};

const getBorrowedMoneyById = async (id) => {
  return await BorrowedMoney.findById(id).populate("person", "name address phoneNumber").populate("category", "name type");
};

const updateBorrowedMoneyById = async (id, data) => {
  return await BorrowedMoney.findByIdAndUpdate(id, data, { new: true }).populate("person", "name address phoneNumber").populate("category", "name type");
};

const patchBorrowedMoneyById = async (id, data) => {
  return await BorrowedMoney.findByIdAndUpdate(id, { $set: data }, { new: true }).populate("person", "name address phoneNumber").populate("category", "name type");
};

const deleteBorrowedMoneyById = async (id) => {
  return await BorrowedMoney.findByIdAndDelete(id);
};

module.exports = {
  createBorrowedMoney,
  getAllBorrowedMoney,
  getBorrowedMoneyById,
  updateBorrowedMoneyById,
  patchBorrowedMoneyById,
  deleteBorrowedMoneyById,
};
