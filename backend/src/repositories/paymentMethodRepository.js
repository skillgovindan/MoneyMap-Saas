const PaymentMethod = require("../models/paymentMethodModel");

const createPaymentMethod = (data) => {
  return PaymentMethod.create(data);
};

const getAllPaymentMethods = () => {
  return PaymentMethod.find().sort({ createdAt: -1 });
};

const getActivePaymentMethods = () => {
  return PaymentMethod.find({ isActive: true }).sort({ createdAt: -1 });
};

const getPaymentMethodById = (id) => {
  return PaymentMethod.findById(id);
};

const getPaymentMethodByName = (name) => {
  return PaymentMethod.findOne({ name });
};

const updatePaymentMethodById = (id, data) => {
  return PaymentMethod.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const patchPaymentMethodById = (id, data) => {
  return PaymentMethod.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const deletePaymentMethodById = (id) => {
  return PaymentMethod.findByIdAndDelete(id);
};

module.exports = {
  createPaymentMethod,
  getAllPaymentMethods,
  getActivePaymentMethods,
  getPaymentMethodById,
  getPaymentMethodByName,
  updatePaymentMethodById,
  patchPaymentMethodById,
  deletePaymentMethodById,
};
