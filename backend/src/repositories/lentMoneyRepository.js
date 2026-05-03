const LentMoney = require("../models/lentMoneyModel");

const createLentMoney = async (data) => {
  return await LentMoney.create(data);
};

const getAllLentMoney = async () => {
  return await LentMoney.find().sort({ createdAt: -1 }).populate("person", "name address phoneNumber").populate("category", "name type");
};

const getLentMoneyById = async (id) => {
  return await LentMoney.findById(id).populate("person", "name address phoneNumber").populate("category", "name type");
};

const updateLentMoneyById = async (id, data) => {
  return await LentMoney.findByIdAndUpdate(id, data, { new: true }).populate("person", "name address phoneNumber").populate("category", "name type");
};

const patchLentMoneyById = async (id, data) => {
  return await LentMoney.findByIdAndUpdate(id, { $set: data }, { new: true }).populate("person", "name address phoneNumber").populate("category", "name type");
};

const deleteLentMoneyById = async (id) => {
  return await LentMoney.findByIdAndDelete(id);
};

module.exports = {
  createLentMoney,
  getAllLentMoney,
  getLentMoneyById,
  updateLentMoneyById,
  patchLentMoneyById,
  deleteLentMoneyById,
};
